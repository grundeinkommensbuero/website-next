/**
 * Component to create a meetup using mapbox to define the location.
 * Including steps from the following tutorial: https://docs.mapbox.com/help/tutorials/local-search-geocoding-api/
 */

import React, { useEffect, useRef, useState } from 'react';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Map, { LocationType } from '../CollectionMap/Map';
import { Field, Form } from 'react-final-form';
import FormWrapper from '../Forms/FormWrapper';
import { TextInputWrapped } from '../Forms/TextInput';
import FormSection from '../Forms/FormSection';
import s from './style.module.scss';
import cN from 'classnames';
import { DateInputWrapped, TimeInputWrapped } from '../Forms/DateTimeInput';
import { CTAButton, CTAButtonContainer } from '../Forms/CTAButton';
import {
  CreateMeetupData,
  useCreateMeetup,
} from '../../hooks/Api/Meetups/Create';
import { FinallyMessage } from '../Forms/FinallyMessage';
import { MapConfig } from '../CollectionMap';
import { GeocoderEvent } from '../CollectionMap/LazyMap';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

type CreateMeetupProps = {
  mapConfig: MapConfig;
  type: LocationType;
  onCreatedMeetup: () => void;
  setShowModal: (showModal: boolean) => void;
};

// Type can be either collect or lists
const CreateMeetup = ({
  mapConfig,
  type = 'collect',
  onCreatedMeetup,
  setShowModal,
}: CreateMeetupProps) => {
  const [location, setLocation] = useState<MapboxGeocoder.Result>();
  const [createMeetupState, createMeetup] = useCreateMeetup();

  const [overlayCloseTimer, setOverlayCloseTimer] = useState(0);

  const scrollToRef = useRef<HTMLDivElement>(null);

  // Date input element is only available in form of type collect
  const dateInputEl = useRef<HTMLInputElement>(null);
  // Name input element is only available in form of type lists
  const nameInputEl = useRef<HTMLInputElement>(null);

  const handleLocationChosen = (e: GeocoderEvent) => {
    setLocation(e.result);
    // Scroll to form
    if (scrollToRef?.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Set timeout to first smooth scroll and then focus
    setTimeout(() => {
      // Depending on the form type a different input element will
      // be rendered
      if (dateInputEl?.current) {
        dateInputEl.current.focus();
      } else if (nameInputEl?.current) {
        nameInputEl.current.focus();
      }
    }, 1000);
  };

  useEffect(() => {
    if (createMeetupState === 'saved') {
      // Set flag in context, so we can reload meetups in map
      if (onCreatedMeetup) {
        onCreatedMeetup();
      }

      countdown();
    }
    // eslint-disable-next-line
  }, [createMeetupState]);

  const countdown = () => {
    let seconds = 5;
    const tick = () => {
      seconds--;
      setOverlayCloseTimer(seconds);
      if (seconds > 0) {
        setTimeout(tick, 1000);
      } else {
        setShowModal(false);
      }
    };
    tick();
  };

  if (
    createMeetupState === 'saving' ||
    createMeetupState === 'saved' ||
    createMeetupState === 'error'
  ) {
    let messageState;

    if (createMeetupState === 'saving') {
      messageState = 'progress';
    } else if (createMeetupState === 'error') {
      messageState = 'error';
    } else {
      messageState = 'success';
    }

    return (
      <FinallyMessage
        loading={messageState === 'progress'}
        className={s.message}
      >
        <>
          {createMeetupState === 'saving' && 'Wird gespeichert...'}
          {createMeetupState === 'saved' && (
            <>
              <p>
                Dein Eintrag wurde gespeichert. Vielen Dank! Du kannst dieses
                Fenster jetzt schließen. Es schließt sich automatisch in{' '}
                {overlayCloseTimer}
              </p>
            </>
          )}
          {createMeetupState === 'error' && (
            <>
              Da ist was schief gegangen. Melde dich bitte bei{' '}
              <a href="mailto:support@expedition-grundeinkommen.de">
                support@expedition-grundeinkommen.de
              </a>
            </>
          )}
        </>
      </FinallyMessage>
    );
  }

  return (
    <section className={s.section}>
      <h3>Wähle einen Ort aus!</h3>
      <Map
        onLocationChosen={handleLocationChosen}
        withSearch={true}
        mapConfig={mapConfig}
        hideLegend={true}
      />
      {location && (
        <>
          <p className={s.chosenLocation}>
            <span className={s.coloredText}>Gewählter Ort:</span>
            <span className={s.placeName}>{location.place_name}</span>
          </p>

          <Form
            onSubmit={e => {
              const data: CreateMeetupData = {
                locationName: e.name,
                description: e.description,
                contact: e.contact,
                coordinates: location.center,
                address: location.address
                  ? `${location.text} ${location.address}`
                  : location.text,
                city: location.context.find(({ id }) => id.startsWith('place'))
                  ?.text,
                zipCode: location.context.find(({ id }) =>
                  id.startsWith('postcode')
                )?.text,
                type,
                campaignCode: `${mapConfig.state}-${
                  mapConfig.state === 'democracy' ? '1' : '2' // If not democracy this should be only hamburg-2 anyway
                }`,
              };

              // Only had dates if type is collect
              if (type === 'collect') {
                data.startTime = new Date(`${e.date}T${e.start}`).toISOString();
                data.endTime = new Date(`${e.date}T${e.end}`).toISOString();
              }

              createMeetup(data, mapConfig.state === 'berlin');
            }}
            validate={values => validate(values, type)}
            render={({ handleSubmit }) => (
              <FormWrapper>
                <form onSubmit={handleSubmit}>
                  {type === 'collect' && (
                    <FormSection
                      className={s.formSection}
                      fieldContainerClassName={s.inlineFieldSection}
                    >
                      <div className={s.formContainer}>
                        <div className={s.dateInputRow}>
                          <p className={s.eventText}>Du planst ein Event am:</p>
                          <Field
                            name="date"
                            label="Datum"
                            component={DateInputWrapped as any}
                            customRef={dateInputEl}
                          ></Field>
                        </div>
                        <div className={s.timeInputRow}>
                          <div className={s.timeInput}>
                            <p className={s.eventText}>von:</p>
                            <Field
                              name="start"
                              label="Start"
                              component={TimeInputWrapped as any}
                            ></Field>
                          </div>
                          <div className={s.timeInput}>
                            <p className={s.eventText}>bis:</p>
                            <Field
                              name="end"
                              label="Ende"
                              component={TimeInputWrapped as any}
                            ></Field>
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  )}
                  {type === 'lists' && (
                    <FormSection className={s.formSection}>
                      <Field
                        name="name"
                        label="Name"
                        placeholder="Name"
                        type="text"
                        inputClassName={s.textInput}
                        component={TextInputWrapped as any}
                        customRef={nameInputEl}
                      ></Field>
                    </FormSection>
                  )}
                  <div ref={scrollToRef}></div>

                  <FormSection>
                    <p>
                      Bitte gib ein paar zusätzliche Infos an. Wo willst du
                      sammeln? Sollen die anderen Sammler*innen etwas
                      mitbringen? Wie findet ihr zueinander?
                    </p>
                    <Field
                      name="description"
                      label="Beschreibung"
                      placeholder="Sag ein paar Sätze zum geplanten Event..."
                      type="textarea"
                      inputClassName={s.textarea}
                      component={TextInputWrapped as any}
                    ></Field>
                    <p>
                      Gib ein paar Infos über dich an: Woran erkennt man dich
                      vor Ort und wie kann man dich kontaktieren? Bitte beachte,
                      dass diese Angaben öffentlich auf der Karte zu sehen sein
                      werden.
                    </p>
                    <Field
                      name="contact"
                      label="Informationen über dich"
                      placeholder="Beschreibung"
                      type="textarea"
                      inputClassName={cN(s.textarea, s.shortTextarea)}
                      component={TextInputWrapped as any}
                    ></Field>
                  </FormSection>

                  <CTAButtonContainer className={s.buttonContainer}>
                    <CTAButton type="submit" size="MEDIUM">
                      Ort eintragen
                    </CTAButton>
                  </CTAButtonContainer>
                </form>
              </FormWrapper>
            )}
          />
        </>
      )}
    </section>
  );
};

type FormValues = {
  description?: string;
  name?: string;
  date?: string;
  start?: string;
  end?: string;
};

type FormErrors = FormValues;

const validate = (values: FormValues, type: LocationType) => {
  const errors: FormErrors = {};

  if (!values.description) {
    errors.description = 'Bitte gib eine kurze Beschreibung an';
  }

  if (type === 'lists' && !values.name) {
    errors.name = 'Bitte gib einen Namen des Sammelortes an';
  }

  if (type === 'collect') {
    if (!values.date) {
      errors.date = 'Bitte gib ein Datum an';
    }

    if (!values.start) {
      errors.start = 'Bitte gib einen Start an';
    }

    if (!values.end) {
      errors.end = 'Bitte gib ein Ende an';
    }
  }

  return errors;
};

export default CreateMeetup;
