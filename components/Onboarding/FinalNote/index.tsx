import React, { SetStateAction } from 'react';
import gS from '../style.module.scss';
import s from './style.module.scss';
import { Button } from '../../Forms/Button';
// import Confetti from '../../Confetti';
import { PageContainer } from '../PageContainer';
import { Municipality } from '../../../context/Municipality';
import { useRouter } from 'next/router';

type FinalNoteProps = {
  municipality: Municipality | null;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
};

export const FinalNote = ({ municipality, setShowModal }: FinalNoteProps) => {
  const router = useRouter();
  const isLotteryPage =
    typeof window !== 'undefined'
      ? window.location.pathname.includes('verlosung')
      : false;

  // Kind of hacky, but we can probably just remove it after the christmas lottery
  // Did not come up with a more clever solution just now
  if (isLotteryPage) {
    return (
      <PageContainer>
        <h3 className={gS.moduleTitle}>Vielen Dank für die Anmeldung!</h3>

        <Button
          className={s.redirectButton}
          onClick={() => {
            setShowModal(false);
          }}
        >
          Weiter zur Verlosung
        </Button>
      </PageContainer>
    );
  }

  return (
    <section className={gS.pageContainer}>
      <h3 className={gS.moduleTitle}>Wie geht es jetzt weiter?</h3>
      <p className={gS.descriptionTextLarge}>
        Danke! Schau doch in den kommenden Tagen wieder vorbei und sieh nach....
      </p>

      <Button
        className={s.redirectButton}
        onClick={() => {
          setShowModal(false);
          router.push('/aktiv-werden');
        }}
      >
        Zur Mitmachen-Seite
      </Button>

      <p>
        Auf deiner Ortsseite findest du alle aktuellen Informationen für deine
        Kampagne {municipality ? `in ${municipality.name}` : ''}. Dort siehst du
        auch, ob sich dein Ort schon qualifiziert hat. Ebenso findest du auf der
        Webseite deine persönliche Profilseite und viele spannende
        Informationen.
      </p>

      <Button
        className={s.redirectButton}
        onClick={() => {
          setShowModal(false);
          router.push(`/orte/${municipality?.slug}`);
        }}
      >
        Zur Unterseite
      </Button>

      {/* <Confetti></Confetti> */}
    </section>
  );
};
