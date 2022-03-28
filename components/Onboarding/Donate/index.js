import React, { useState } from 'react';
import * as gS from '../style.module.less';
import * as s from './style.module.less';
import DonationForm from '../../Forms/DonationForm';
import { InlineButton } from '../../Forms/Button';

export const Donate = ({
  userData,
  userId,
  updateUser,
  updateCustomUserData,
  compIndex,
  setCurrentElementByIndex,
  municipality,
}) => {
  const [showDonationForm, setShowDonationForm] = useState(false);

  const saveDonationReaction = type => {
    const existingReactions = [...userData?.store?.donationOnboardingReaction];
    const reactionForMunicipality = {
      ags: municipality.ags,
      reaction: type,
      timestamp: new Date(),
    };
    // Find and update reaction for ags or add a new one
    const reactionIndex = existingReactions.findIndex(
      el => el?.ags === municipality.ags
    );
    if (reactionIndex !== -1) {
      existingReactions[reactionIndex] = reactionForMunicipality;
    } else {
      existingReactions.push(reactionForMunicipality);
    }
    // Save updated Reaction Array
    updateUser({
      userId: userId,
      store: {
        donationOnboardingReaction: existingReactions,
      },
    });
    // Refresh local userData Object
    setTimeout(() => {
      updateCustomUserData();
    }, 500);
  };

  return (
    <section className={gS.pageContainer}>
      {showDonationForm ? (
        <>
          <DonationForm
            onboardingNextPage={() => setCurrentElementByIndex(compIndex + 1)}
          />
        </>
      ) : (
        <>
          <h3 className={gS.moduleTitle}>
            Mach die Expedition mit deiner Spende möglich
          </h3>
          <p className={gS.descriptionTextLarge}>
            Die Expedition ist gemeinnützig und spendenfinanziert. Sie gibt es
            nur, wenn alle etwas in die Reisekasse legen. Spende jetzt, damit
            wir gemeinsam das Grundeinkommen{' '}
            {municipality ? `in ${municipality.name} und ` : ''}ganz Deutschland
            Wirklichkeit werden lassen!
          </p>

          <div className={gS.buttonRow}>
            <button
              className={s.engagementOption}
              onClick={() => setShowDonationForm(true)}
            >
              Jetzt spenden
            </button>

            <button
              className={s.engagementOption}
              onClick={() => {
                saveDonationReaction('remindMeLater');
                setCurrentElementByIndex(compIndex + 1);
              }}
            >
              Später erinnern
            </button>
          </div>

          <div className={gS.fullWidthFlex}>
            <InlineButton
              aria-label={'Schritt überspringen'}
              onClick={() => {
                saveDonationReaction('skipedDonation');
                setCurrentElementByIndex(compIndex + 1);
              }}
            >
              Überspringen
            </InlineButton>
          </div>
        </>
      )}
    </section>
  );
};
