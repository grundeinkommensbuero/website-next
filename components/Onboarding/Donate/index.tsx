import React, { useState } from 'react';
import gS from '../style.module.scss';
import s from './style.module.scss';
import DonationForm from '../../Forms/DonationForm';
import { InlineButton } from '../../Forms/Button';
import { User } from '../../../context/Authentication';
import { Municipality } from '../../../context/Municipality';
import { PageContainer } from '../PageContainer';

type DonateProps = {
  userData: User;
  userId: string;
  updateUser: (data: any) => Promise<void>;
  updateCustomUserData: (() => Promise<void>) | null;
  compIndex: number;
  setCurrentElementByIndex: (index: number) => void;
  municipality: Municipality | null;
};

export const Donate = ({
  userData,
  userId,
  updateUser,
  updateCustomUserData,
  compIndex,
  setCurrentElementByIndex,
  municipality,
}: DonateProps) => {
  const [showDonationForm, setShowDonationForm] = useState(false);

  type Reaction = {
    ags?: string;
    reaction: string;
    timestamp: Date;
  };

  const saveDonationReaction = (type: string) => {
    const existingReactions: Reaction[] = userData?.store
      ?.donationOnboardingReaction
      ? [...userData?.store?.donationOnboardingReaction]
      : [];
    const reactionForMunicipality = {
      ags: municipality?.ags,
      reaction: type,
      timestamp: new Date(),
    };
    if (existingReactions.length > 0) {
      // Find and update reaction for ags or add a new one
      const reactionIndex = existingReactions.findIndex(
        (el: any) => el?.ags === municipality?.ags
      );
      if (reactionIndex !== -1) {
        existingReactions[reactionIndex] = reactionForMunicipality;
      } else {
        existingReactions.push(reactionForMunicipality);
      }
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
      updateCustomUserData && updateCustomUserData();
    }, 500);
  };

  return (
    <PageContainer>
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
    </PageContainer>
  );
};
