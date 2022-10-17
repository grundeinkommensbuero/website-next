import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  formatDateShort,
  formatDateShortIso,
  formatDateTime,
  formatTime,
  getDayAsString,
} from '../../utils/date';
import s from './style.module.scss';
import { FinallyMessage } from '../Forms/FinallyMessage';

import PinIcon from './icon-pin.svg';
import CalenderIcon from './icon-calendar.svg';
import CollectIcon from './icon-collect.svg';
import SignIcon from './icon-sign.svg';
import StorageIcon from './icon-storage.svg';
import CollectIconBerlin from './icon-collect-berlin.svg';
import SignIconBerlin from './icon-sign-berlin.svg';
import StorageIconBerlin from './icon-storage-berlin.svg';

import { detectWebGLContext } from '../../utils/detectWebGLContext';
import { InlineLinkButton } from '../Forms/Button';
import { Location, MapProps } from './Map';
import mapboxgl, { Marker } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Coordinates } from '.';
import { LoadingAnimation } from '../LoadingAnimation';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW55a2V5IiwiYSI6ImNrM3JkZ2IwMDBhZHAzZHBpemswd3F3MjYifQ.RLinVZ2-Vdp9JwErHAJz6w';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const DEFAULT_BOUNDS: [Coordinates, Coordinates] = [
  [3, 47.217923],
  [17.030017, 55.437655],
];

type MapboxConfigDefault = {
  container: any;
  style: string;
  maxBounds: [Coordinates, Coordinates];
};

export type GeocoderEvent = { result: MapboxGeocoder.Result };

/**
 * The `config` JSON field on a Contentful Map takes values that will be directly
 * passed in to the mapboxgl map constructor. This function extends the default mapbox config
 * only adding or overriding any properties that have a value on Contentful.
 *
 * @param {{}} defaultConfig Default mapbox config to add props to
 * @param {{key: string; value: any}[]} props Props that get added to or override default config
 */
const addPropsToMapboxConfig = (
  defaultConfig: MapboxConfigDefault,
  props: { [key: string]: any }
) => {
  if (!props) return defaultConfig;

  // Loop through each key of each prop
  const configWithoutNulls = Object.keys(props).reduce((acc, key) => {
    // If value, add to accumulator
    if (props[key]) {
      return {
        ...acc,
        [key]: props[key],
      };
    }
    // Otherwise, return accumulator
    return acc;
  }, {});

  // Merge Contentful properties with the default
  return {
    ...defaultConfig,
    ...configWithoutNulls,
  };
};

const LazyMap = ({
  locations,
  mapConfig,
  withSearch = false,
  onLocationChosen,
  className,
  hideLegend = false,
}: MapProps) => {
  const [hasWebGl, setHasWebGL] = useState<boolean | null>(null);

  const container = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [highlightedPoint, setHighlightedPoint] = useState<Location[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    setHasWebGL(detectWebGLContext());
  }, []);

  useEffect(() => {
    if (hasWebGl) {
      // Initialize map only once
      if (!map.current) {
        // Default config for mapboxgl
        const mapboxConfigDefault: MapboxConfigDefault = {
          container: container.current,
          style: 'mapbox://styles/mapbox/streets-v9',
          maxBounds: DEFAULT_BOUNDS,
        };

        const mapboxConfig = addPropsToMapboxConfig(
          mapboxConfigDefault,
          mapConfig
        );

        map.current = new mapboxgl.Map(mapboxConfig).addControl(
          new mapboxgl.NavigationControl(),
          'top-left'
        );

        if (withSearch) {
          // Initialize geo coder
          const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl as any,
            placeholder: 'Nach Ort suchen',
            bbox: [...mapboxConfig.maxBounds[0], ...mapboxConfig.maxBounds[1]],
          });

          geocoder.on('result', (e: GeocoderEvent) => {
            if (onLocationChosen) {
              console.log(e);
              onLocationChosen(e);
            }
          });

          map.current.addControl(geocoder);
        } else {
          // For now we want to only either show search or geolocation button. Both take too much space.
          // It looks weird, and since we still cannot choose a location (when creating an event) on the map
          // the geolocation is not really helpful in that case

          // Geolocation to jump to current location
          const geoLocation = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: false,
          });

          map.current.addControl(geoLocation);
        }
      }

      if (locations && map.current !== null) {
        // Remove old markers from map
        markers.forEach(marker => marker.remove());

        const markerArray: Marker[] = [];
        // Sort locations, so the next events are added last, so they are on top
        // if it is the same location
        locations.sort((a, b) =>
          a.startTime && b.startTime
            ? new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            : 0
        );

        locations.forEach(meetup => {
          if (meetup.coordinates) {
            const element = document.createElement('div');

            let markerClass;
            if (IS_BERLIN_PROJECT) {
              if (meetup.type === 'collect') {
                markerClass = s.collectBerlin;
              } else if (meetup.type === 'lists') {
                markerClass = s.signBerlin;
              } else {
                markerClass = s.storageBerlin;
              }
            } else {
              if (meetup.type === 'collect') {
                markerClass = s.collect;
              } else if (meetup.type === 'lists') {
                markerClass = s.sign;
              } else {
                markerClass = s.storage;
              }
            }

            element.className = `${s.marker} ${markerClass}`;

            const marker = new mapboxgl.Marker(element)
              .setLngLat([meetup.coordinates.lon, meetup.coordinates.lat])
              .addTo(map.current!)
              .setPopup(
                new mapboxgl.Popup()
                  .setHTML(renderToStaticMarkup(<PopupContent {...meetup} />))
                  .on('open', () => {
                    highlightedPoint.push(meetup);
                    setHighlightedPoint([...highlightedPoint]);
                  })
                  .on('close', () => {
                    highlightedPoint.shift();
                    setHighlightedPoint([...highlightedPoint]);
                  })
              );

            markerArray.push(marker);
          }
        });

        setMarkers(markerArray);
      }
    }
  }, [hasWebGl, locations]);

  // Cleanup map
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const StorageIconComponent = IS_BERLIN_PROJECT
    ? StorageIconBerlin
    : StorageIcon;
  const SignIconComponent = IS_BERLIN_PROJECT ? SignIconBerlin : SignIcon;
  const CollectIconComponent = IS_BERLIN_PROJECT
    ? CollectIconBerlin
    : CollectIcon;

  return (
    <>
      <section className={className}>
        {hasWebGl === false && (
          <FinallyMessage>
            Entschuldige bitte, dein Browser unterstützt leider unsere Karte
            nicht, sie benötigt webGL. Bitte mache ein Update deines Browsers
            und/oder deines Betriebssystems oder probiere es in einem anderen
            Browser.
          </FinallyMessage>
        )}

        {(hasWebGl === true || hasWebGl === null) && (
          <div ref={container} className={s.container}>
            {!map.current && (
              <LoadingAnimation className={s.loadingAnimation} />
            )}
          </div>
        )}
      </section>
      {!hideLegend && (
        <div className={IS_BERLIN_PROJECT ? s.legendBerlin : s.legend}>
          <div>
            <StorageIconComponent alt="Illustration eines Materiallagers" />
            <span>Materiallager</span>
          </div>
          <div>
            <SignIconComponent alt="Illustration einer UnterschriftenListe" />
            <span>Soli-Ort</span>
          </div>
          <div>
            <CollectIconComponent alt="Illustration eines Sammelevents" />
            <span>Sammelevent</span>
          </div>
        </div>
      )}
      {highlightedPoint.length !== 0 && (
        <section className={s.popUpOutside}>
          <div>
            <PopupContent {...highlightedPoint[0]} />
          </div>
        </section>
      )}
    </>
  );
};

const PopupContent = ({
  title,
  description,
  date,
  phone,
  mail,
  startTime,
  endTime,
  contact,
  address,
  city,
  zipCode,
  locationName,
  type,
  typeOfStorage,
}: Location) => (
  <div className={s.tooltip}>
    {date && <div>{formatDateTime(new Date(date))}</div>}
    <h3 className={s.tooltipTitle}>{title}</h3>
    {((startTime && endTime) || address || locationName) && (
      <div className={s.tooltipTimeAndPlace}>
        {startTime && endTime && (
          <div className={s.tooltipInfoWithIcon}>
            <CalenderIcon
              alt="Illustration eines Kalenders"
              className={s.tooltipIconCalender}
            />
            <div className={s.tooltipDate}>
              <span className={s.tooltipDay}>
                {getDayAsString(new Date(startTime))},{' '}
                {formatDateShort(new Date(startTime))}
              </span>
              <br />
              <span className={s.tooltipTime}>
                {formatTime(new Date(startTime))} -{' '}
                {formatTime(new Date(endTime))} Uhr
              </span>
            </div>
          </div>
        )}
        {(address || locationName) && (
          <div className={s.tooltipInfoWithIcon}>
            <PinIcon
              alt="Illustration einer Markierung"
              className={s.tooltipIconPin}
            />
            <div className={s.tooltipLocation}>
              <span className={s.tooltipAddress}>
                {/* If address and location name both exist, show both, otherwise only one */}
                {address && locationName ? (
                  <>
                    {address}
                    <br />
                    {type === 'collect' && 'Kiez: '}
                    {locationName}
                  </>
                ) : (
                  address || locationName
                )}
                {typeOfStorage && (
                  <>
                    <br />
                    {typeOfStorage}
                  </>
                )}
              </span>
              <br />
              {zipCode && city && (
                <span className={s.tooltipZipCode}>
                  {zipCode} {city}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    )}
    {description && (
      <div className={s.tooltipDescription}>
        <h4 className={s.tooltipHeading}>
          {type === 'storage' ? 'Was ist da?' : 'Information'}
        </h4>
        {description}
      </div>
    )}
    {phone && (
      <div>
        <span aria-label="phone" role="img">
          📞
        </span>{' '}
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
    )}
    {mail && (
      <div>
        <span aria-label="e-mail" role="img">
          ✉️
        </span>{' '}
        <a href={`mailto:${mail}`}>{mail}</a>
      </div>
    )}
    {contact && (
      <div>
        <h4 className={s.tooltipHeading}>Kontakt</h4>
        {contact}
      </div>
    )}
    {type === 'collect' && startTime && (
      <div>
        <h4 className={s.tooltipHeading}>Du bist dabei?</h4>
        <InlineLinkButton
          href={`/sammeln/anmelden?location=${
            address || locationName
          }&date=${formatDateShortIso(new Date(startTime))}`}
          target="_blank"
        >
          Hier
        </InlineLinkButton>{' '}
        kannst du dich für das Sammel-Event anmelden.{' '}
      </div>
    )}
  </div>
);

export default LazyMap;
