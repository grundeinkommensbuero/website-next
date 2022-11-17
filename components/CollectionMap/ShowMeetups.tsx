import React, { useEffect, useState } from 'react';
import { useGetMeetups } from '../../hooks/Api/Meetups/Get';
import Map, { Location, LocationType } from './Map';
import { Button, DropdownButton } from '../Forms/Button';
import s from './style.module.scss';
import { Modal } from '../Modal';
import { EventsListed } from './EventsListed';
import { Checkbox } from '../Forms/Checkbox';
import FormWrapper from '../Forms/FormWrapper';
import FormSection from '../Forms/FormSection';
import {
  checkIfDateIsDayAfterTomorrow,
  checkIfDateIsToday,
  checkIfDateIsTomorrow,
} from './utils/dateStringManipulation';
import { MapConfig } from '.';
import dynamic from 'next/dynamic';
import { List as Loader } from 'react-content-loader';
import { useRouter } from 'next/router';
import cN from 'classnames';
import { CTALink } from '../Forms/CTAButton';
import CollectIcon from './icon-collect.svg';
import SignIcon from './icon-sign.svg';
import StorageIcon from './icon-storage.svg';
import CollectIconBerlin from './icon-collect-berlin.svg';
import SignIconBerlin from './icon-sign-berlin.svg';
import StorageIconBerlin from './icon-storage-berlin.svg';
import DeliveryIconBerlin from './icon-delivery-berlin.svg';
import PlacardIconBerlin from './icon-placard-berlin.svg';
import querystring from 'query-string';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type UrlParams = {
  delivery?: boolean;
  storage?: boolean;
  collect?: boolean;
  lists?: boolean;
};

const CreateMeetup = dynamic(() => import('../CreateMeetup'), {
  ssr: true,
  loading: () => <Loader />,
});

export const ShowMeetups = ({
  mapConfig,
  className,
  isIframe = false,
}: {
  mapConfig: MapConfig;
  className?: string;
  isIframe?: boolean;
}) => {
  const [meetups, getMeetups] = useGetMeetups();
  const [locationsFiltered, setLocationsFiltered] = useState<Location[]>();
  const [allLocations, setAllLocations] = useState<Location[]>();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<LocationType>('collect');

  const router = useRouter();

  // Map filters
  // Type filters, depending on the slug we show different default filters
  const [showLists, setShowLists] = useState(
    router.asPath.includes('soli-orte') ||
      router.asPath.includes('unterschreiben') ||
      isIframe
  );
  const [showCollectionEvents, setShowCollectionEvents] = useState(
    router.asPath.includes('termine') || router.pathname === '/' || isIframe
  );
  const [showStorages, setShowStorages] = useState(
    router.asPath.includes('material') || router.pathname === '/' || isIframe
  );
  const [showDeliveryLocations, setShowDeliveryLocations] = useState(isIframe);
  const [showPlacards, setShowPlacards] = useState(false);

  // Day filters
  const [filterToday, setFilterToday] = useState(false);
  const [filterTomorrow, setFilterTomorrow] = useState(false);
  const [filterDayAfterTomorrow, setFilterDayAfterTomorrow] = useState(false);

  // Time filters
  const [filterBefore12, setFilterBefore12] = useState(true);
  const [filterBefore18, setFilterBefore18] = useState(true);
  const [filterAfter18, setFilterAfter18] = useState(true);

  const [showDayFilters, setShowDayFilters] = useState(false);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  const isBremen = mapConfig.state === 'bremen';
  const isBerlin = mapConfig.state === 'berlin';
  const isHamburg = mapConfig.state === 'hamburg';
  const isDemocracy = mapConfig.state === 'democracy';
  const isClimate = mapConfig.state === 'climate';

  useEffect(() => {
    // We only need to fetch meetups from secondary API if it's the berlin or hamburg map
    if (isBerlin || isHamburg || isDemocracy || isClimate) {
      // We pass state to differentiate between APIs

      // The whole naming of meetups does not really make that much sense anymore, since
      // we are using the new api backend structure, where list locations and events are two
      // entirely different api and schemas.
      // I am leaving it like this anyway, just beware that meetups are events OR list locations
      getMeetups(mapConfig.state);
    }
  }, [mapConfig]);

  const onCreatedMeetup = () => {
    getMeetups(mapConfig.state);
  };

  useEffect(() => {
    if (meetups) {
      setAllLocations(meetups);
    }
  }, [meetups]);

  useEffect(() => {
    if (allLocations) {
      if (isBremen) {
        setLocationsFiltered(allLocations);
      } else {
        // Filter by type, filter by date (endTime exists = only for collection events)
        // and filter by time (also only for collection events)
        const newLocationsFiltered = allLocations.filter(
          ({ type, startTime, endTime }) => {
            const startInHours = startTime && new Date(startTime).getHours();

            return (
              ((showLists && type === 'lists') ||
                (showCollectionEvents && type === 'collect') ||
                (showStorages && type === 'storage') ||
                (showDeliveryLocations && type === 'delivery') ||
                (showPlacards && type === 'placard')) &&
              // Filter for both start and endtime:
              // if endtime exists we want to include it in the filtering
              // If endtime and startime don't exist (should not happen) we don't filter
              // I used to check only endtime, because app always created events with event time
              // but this won't be the case in the future
              ((!endTime && !startTime) ||
                (endTime &&
                  ((!filterToday &&
                    !filterTomorrow &&
                    !filterDayAfterTomorrow) ||
                    (filterToday && checkIfDateIsToday(new Date(endTime))) ||
                    (filterTomorrow &&
                      checkIfDateIsTomorrow(new Date(endTime))) ||
                    (filterDayAfterTomorrow &&
                      checkIfDateIsDayAfterTomorrow(new Date(endTime))))) ||
                (startTime &&
                  ((!filterToday &&
                    !filterTomorrow &&
                    !filterDayAfterTomorrow) ||
                    (filterToday && checkIfDateIsToday(new Date(startTime))) ||
                    (filterTomorrow &&
                      checkIfDateIsTomorrow(new Date(startTime))) ||
                    (filterDayAfterTomorrow &&
                      checkIfDateIsDayAfterTomorrow(new Date(startTime)))))) &&
              (!startInHours ||
                (filterBefore12 && startInHours < 12) ||
                (filterBefore18 && startInHours >= 12 && startInHours < 18) ||
                (filterAfter18 && startInHours >= 18))
            );
          }
        );
        setLocationsFiltered(newLocationsFiltered);
      }
    }
  }, [
    showLists,
    showCollectionEvents,
    showStorages,
    showDeliveryLocations,
    showPlacards,
    filterToday,
    filterTomorrow,
    filterBefore12,
    filterBefore18,
    filterAfter18,
    allLocations,
  ]);

  useEffect(() => {
    const urlParams = querystring.parse(window.location.search);

    if (Object.keys(urlParams).length > 0) {
      setShowCollectionEvents('collect' in urlParams);
      setShowLists('lists' in urlParams);
      setShowDeliveryLocations('delivery' in urlParams);
      setShowStorages('storage' in urlParams);
      setShowPlacards('placard' in urlParams);
    }
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
      {!isBremen && (
        <FormWrapper className={s.filter}>
          <>
            <div className={s.flexRow}>
              <Checkbox
                label={
                  <>
                    <SignIconComponent />
                    Soli Orte anzeigen
                  </>
                }
                type="checkbox"
                checked={showLists}
                onChange={() => setShowLists(!showLists)}
                className={cN(s.inlineCheckbox, {
                  [s.climateCheckbox]: isClimate,
                })}
                labelClassName={s.inlineCheckboxLabel}
              />
              <Checkbox
                label={
                  <>
                    <CollectIconComponent />
                    Sammel-Termine anzeigen
                  </>
                }
                type="checkbox"
                checked={showCollectionEvents}
                onChange={() => setShowCollectionEvents(!showCollectionEvents)}
                className={cN(s.inlineCheckbox, {
                  [s.climateCheckbox]: isClimate,
                })}
                labelClassName={s.inlineCheckboxLabel}
              />
              <Checkbox
                label={
                  <>
                    <StorageIconComponent />
                    Materiallager anzeigen
                  </>
                }
                type="checkbox"
                checked={showStorages}
                onChange={() => setShowStorages(!showStorages)}
                className={cN(s.inlineCheckbox, {
                  [s.climateCheckbox]: isClimate,
                })}
                labelClassName={s.inlineCheckboxLabel}
              />
              <Checkbox
                label={
                  <>
                    <DeliveryIconBerlin color="black" />
                    Abgabeorte anzeigen
                  </>
                }
                type="checkbox"
                checked={showDeliveryLocations}
                onChange={() =>
                  setShowDeliveryLocations(!showDeliveryLocations)
                }
                className={cN(s.inlineCheckbox, {
                  [s.climateCheckbox]: isClimate,
                })}
                labelClassName={s.inlineCheckboxLabel}
              />
              <Checkbox
                label={
                  <>
                    <PlacardIconBerlin color="black" />
                    Plakate anzeigen
                  </>
                }
                type="checkbox"
                checked={showPlacards}
                onChange={() => setShowPlacards(!showPlacards)}
                className={cN(s.inlineCheckbox, {
                  [s.climateCheckbox]: isClimate,
                })}
                labelClassName={s.inlineCheckboxLabel}
              />
            </div>

            <div className={s.flexRow}>
              <div className={s.dropdown}>
                <DropdownButton
                  className={cN(s.dropdownButton, {
                    [s.climateDropdownButton]: isClimate,
                  })}
                  onClick={() => setShowDayFilters(!showDayFilters)}
                  isOpen={showDayFilters}
                  isActive={filterTomorrow || filterToday}
                >
                  Tag auswählen
                </DropdownButton>

                {showDayFilters && (
                  <FormSection className={s.dropdownContent}>
                    <Checkbox
                      label="Egal"
                      type="checkbox"
                      checked={
                        !filterTomorrow &&
                        !filterToday &&
                        !filterDayAfterTomorrow
                      }
                      onChange={() => {
                        setFilterToday(false);
                        setFilterTomorrow(false);
                        setFilterDayAfterTomorrow(false);
                      }}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                    <Checkbox
                      label="Heute"
                      type="checkbox"
                      checked={filterToday}
                      onChange={() => setFilterToday(!filterToday)}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                    <Checkbox
                      label="Morgen"
                      type="checkbox"
                      checked={filterTomorrow}
                      onChange={() => setFilterTomorrow(!filterTomorrow)}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                    <Checkbox
                      label="Übermorgen"
                      type="checkbox"
                      checked={filterDayAfterTomorrow}
                      onChange={() =>
                        setFilterDayAfterTomorrow(!filterDayAfterTomorrow)
                      }
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                  </FormSection>
                )}
              </div>

              <div className={s.dropdown}>
                <DropdownButton
                  className={cN(s.dropdownButton, {
                    [s.climateDropdownButton]: isClimate,
                  })}
                  onClick={() => setShowTimeFilters(!showTimeFilters)}
                  isOpen={showTimeFilters}
                  isActive={
                    !filterBefore12 || !filterBefore18 || !filterAfter18
                  }
                >
                  Uhrzeit auswählen
                </DropdownButton>

                {showTimeFilters && (
                  <FormSection className={s.dropdownContent}>
                    <Checkbox
                      label="Vor 12 Uhr"
                      type="checkbox"
                      checked={filterBefore12}
                      onChange={() => setFilterBefore12(!filterBefore12)}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                    <Checkbox
                      label="Zwischen 12 und 18 Uhr"
                      type="checkbox"
                      checked={filterBefore18}
                      onChange={() => setFilterBefore18(!filterBefore18)}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                    <Checkbox
                      label="Nach 18 Uhr"
                      type="checkbox"
                      checked={filterAfter18}
                      onChange={() => setFilterAfter18(!filterAfter18)}
                      className={cN({
                        [s.climateCheckbox]: isClimate,
                      })}
                    />
                  </FormSection>
                )}
              </div>
            </div>
          </>
        </FormWrapper>
      )}

      <Map
        mapConfig={mapConfig}
        locations={locationsFiltered}
        className={className}
      />
      {!isIframe && router.pathname !== '/' && (
        <>
          {/* Jump to anchor */}
          <div className={s.jumpToAnchorWrapper}>
            <div className={s.jumpToAnchor} id="events" />
          </div>

          <EventsListed locationsFiltered={locationsFiltered} />
        </>
      )}

      {(isBerlin || isHamburg || isDemocracy || isClimate) && (
        <div>
          {!isIframe && router.pathname !== '/' && (
            <>
              {/* Jump to anchor */}
              <div className={s.jumpToAnchorWrapper}>
                <div className={s.jumpToAnchor} id="eintragen" />
              </div>

              <section className={cN(s.ctasUnderMap)}>
                <div className={s.cta}>
                  <h3>Plane eine Sammelaktion!</h3>
                  <p>
                    Du hast Lust vor Ort in der Expedition mitzumachen? Hier
                    kannst du eine Sammelaktion veröffentlichen um so mehr
                    Unterschriftensammler*innen zu mobilisieren.
                  </p>
                  <Button
                    onClick={() => {
                      setType('collect');
                      setShowModal(true);
                    }}
                  >
                    Event erstellen
                  </Button>
                </div>
                <div className={s.cta}>
                  <h3>Lege Listen an einem Soli-Ort aus</h3>
                  <p>
                    Markiere einen Ort, an dem du eine neue Unterschriftenliste
                    ausgelegt hast, um sie für andere sichtbar zu machen. Melde
                    dich gern bei uns, wenn du Material benötigst.
                  </p>
                  <Button
                    onClick={() => {
                      setType('lists');
                      setShowModal(true);
                    }}
                  >
                    Ort eintragen
                  </Button>
                </div>
                <Modal showModal={showModal} setShowModal={setShowModal}>
                  <CreateMeetup
                    type={type}
                    mapConfig={mapConfig}
                    onCreatedMeetup={onCreatedMeetup}
                    setShowModal={setShowModal}
                  />
                </Modal>
              </section>
            </>
          )}

          {router.pathname === '/' && (
            <CTALink to="/termine" className="mt-8">
              Weitere Events
            </CTALink>
          )}
        </div>
      )}
    </>
  );
};
