import React from 'react';
import s from './style.module.scss';
import gS from '../style.module.scss';
import { Button } from '../../Forms/Button';
import cN from 'classnames';

import { MunicipalityInfo } from './MunicipalityInfo';
import { User } from '../../../context/Authentication';
import { PageContainer } from '../PageContainer';

type EngageProps = {
  userData: User;
  compIndex: number;
  setCurrentElementByIndex: (index: number) => void;
};

export const Engage = ({
  userData,
  compIndex,
  setCurrentElementByIndex,
}: EngageProps) => {
  return (
    <PageContainer>
      <h3 className={gS.moduleTitle}>
        Willkommen bei der Expedition Grundeinkommen!
      </h3>
      <p className={gS.descriptionTextLarge}>Hallo {userData.username}!</p>
      <p className={gS.descriptionTextLarge}>
        Unser Ziel ist es, das Grundeinkommen in die Städte und Gemeinden{' '}
        Deutschlands zu holen. Wir freuen uns sehr, dass du uns in GEMEINDE{' '}
        dabei hilfst!
      </p>

      <MunicipalityInfo
        start={0}
        end={75}
        goal={100}
        title={'GEMEINDE'}
        description={'Unterstützer*innen'}
      />

      <h4>Wie kannst du dich einbringen?</h4>
      <p className={gS.descriptionTextLarge}>
        Wir werden dich per Email benachrichtigen, sobald sie
        Unterschriftensammlung in GEMEINDE losgeht.
      </p>
      <p className={gS.descriptionTextLarge}>
        Weißt du schon, wie du helfen kannst?
      </p>
      <br />

      <Button className={cN(s.fullWidthBtn, s.marginBottom)}>
        Ich kann unterschreiben
      </Button>
      <Button className={cN(s.fullWidthBtn, s.marginBottom)}>
        Ich kann Unterschriften sammeln
      </Button>
      <Button className={cN(s.fullWidthBtn, s.marginBottom)}>
        Ich kann Sammelevents organisieren
      </Button>

      <div className={gS.fullWidthFlex}>
        <Button
          className={gS.nextButton}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
        >
          Weiter
        </Button>
      </div>
      <div className={gS.fullWidthFlex}>
        <span
          aria-hidden="true"
          className={gS.linkLikeFormatted}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
        >
          Jetzt nicht
        </span>
      </div>
    </PageContainer>
  );
};
