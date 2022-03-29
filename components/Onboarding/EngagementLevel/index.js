import React from 'react';
import gS from '../style.module.scss';
import s from './style.module.scss';
import cN from 'classnames';
import { PageContainer } from '../PageContainer';

export const EngagementLevel = ({
  userData,
  compIndex,
  setCurrentElementByIndex,
  engagementOption,
  setEngagementOption,
  municipality,
}) => {
  return (
    <PageContainer>
      <h3 className={gS.moduleTitle}>Werde vor Ort aktiv!</h3>
      <p className={gS.descriptionTextLarge}>
        Um die Kampagne {municipality ? `in ${municipality.name} ` : ''} starten
        zu können, werden wir viele Unterschriften brauchen - aber auch
        Freiwillige, die helfen, die Kampagne vor Ort zu organisieren. Hättest
        du darauf Lust?
      </p>

      <div className={gS.buttonRow}>
        <div
          aria-hidden="true"
          className={cN(s.engagementOption, {
            [s.activeOption]: engagementOption === 'wantsToBeActive',
          })}
          onClick={() => {
            setCurrentElementByIndex(compIndex + 1);
            setEngagementOption('wantsToBeActive');
          }}
        >
          Ja, ich würde gerne aktiv werden!
        </div>

        <div
          aria-hidden="true"
          className={cN(s.engagementOption, {
            [s.activeOption]: engagementOption === 'wantsToSignOnly',
          })}
          onClick={() => {
            setCurrentElementByIndex(compIndex + 1);
            setEngagementOption('wantsToSignOnly');
          }}
        >
          Nein, ich möchte lieber nur unterschrieben!
        </div>
      </div>
    </PageContainer>
  );
};
