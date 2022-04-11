import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import s from './style.module.scss';
import gS from '../style.module.scss';
import cN from 'classnames';
import { Checkbox } from '../../Forms/Checkbox';
import { Button } from '../../Forms/Button';
import { CustomNewsletterConsent } from '../../../context/Authentication';

type NewsletterCardProps = {
  newsletter: CustomNewsletterConsent;
  updateSingleNewsletter: (n: CustomNewsletterConsent) => void;
  waitingForApi: boolean;
  componentToBeUpdated: string;
};

export const NewsletterCard = ({
  newsletter,
  updateSingleNewsletter,
  waitingForApi,
  componentToBeUpdated,
}: NewsletterCardProps) => {
  const [newsletterSettings, updateNewsletterSettings] = useState(newsletter);
  const [newsletterRevokeState, setNewsletterRevokeState] = useState(false);

  const toggleNewsletterRevokeProcess = () => {
    setNewsletterRevokeState(!newsletterRevokeState);
  };

  const toggleNewsletterConsent = async () => {
    try {
      const updatedNewsletter = {
        ...newsletterSettings,
      };
      updatedNewsletter.value = !updatedNewsletter.value;

      updateSingleNewsletter(updatedNewsletter);
      updateNewsletterSettings(updatedNewsletter);

      setNewsletterRevokeState(false);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleExtraInfoConsent = (value: { extraInfoConsent: boolean }) => {
    if (value.extraInfoConsent !== newsletterSettings.extraInfo) {
      try {
        const updatedNewsletter = {
          ...newsletterSettings,
        };
        updatedNewsletter.extraInfo = value.extraInfoConsent;
        updatedNewsletter.timestamp = new Date().toISOString();

        updateSingleNewsletter(updatedNewsletter);
        updateNewsletterSettings(updatedNewsletter);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const isEmptyObj = (obj: any) =>
    Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;

  return (
    <div className={cN(s.newsletterCard, 'colorSchemeWhite')}>
      {!newsletterRevokeState ? (
        /* newsletter info claim */
        <section>
          <p className={s.newsletterCardHeading}>{newsletterSettings.name}</p>
          <p className={s.newsletterCardDescription}>
            Du erhältst die wichtigsten Infos für {newsletterSettings.name}
            {newsletterSettings.extraInfo ? (
              <span>, sowie zusätzliche Sammelinfos.</span>
            ) : (
              <span>.</span>
            )}
          </p>
          {/* toggle extra info consent */}
          {waitingForApi && componentToBeUpdated === newsletterSettings.ags ? (
            <span>
              <span className={gS.loading}></span>
              <b className={gS.loadingMsg}>Speichern</b>
            </span>
          ) : (
            <Form
              onSubmit={() => {}}
              initialValues={{ extraInfoConsent: newsletterSettings.extraInfo }}
              validate={
                ((values: any) =>
                  !isEmptyObj(values)
                    ? toggleExtraInfoConsent(values)
                    : null) as any
              }
              render={() => {
                return (
                  <Field
                    name="extraInfoConsent"
                    label={`Für ${newsletterSettings.name} zusätzliche Sammelinfos erhalten`}
                    type="checkbox"
                    component={Checkbox}
                  ></Field>
                );
              }}
            ></Form>
          )}
          {/* toggle newsletter consent */}
          <p className={cN(gS.alignRight, gS.noMargin)}>
            <button
              className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
              onClick={toggleNewsletterRevokeProcess}
            >
              abbestellen
            </button>
          </p>
        </section>
      ) : (
        <section>
          <p className={s.newsletterCardHeading}>
            Bist du sicher, dass du keine Neuigkeiten mehr aus{' '}
            {newsletterSettings.name} bekommen möchtest?
          </p>
          <br />
          <p className={s.newsletterCardDescription}>
            Wir können dich nicht mehr informieren, wenn sich etwas an der
            Kampagne in {newsletterSettings.name} ändert oder neue Sammelevents
            in deiner Nähe geplant werden.
          </p>
          <div className={s.revokeButtonRow}>
            <Button
              className={s.revokeButton}
              onClick={toggleNewsletterConsent}
            >
              Abbestellen
            </Button>
            <div className={s.cancelRevokeProcess}>
              <button
                className={cN(gS.linkLikeFormattedButton, gS.onWhiteBackground)}
                onClick={toggleNewsletterRevokeProcess}
              >
                Newsletter weiter erhalten
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
