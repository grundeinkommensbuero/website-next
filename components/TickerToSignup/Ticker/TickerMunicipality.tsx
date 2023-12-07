import React, { useContext, useState, useEffect } from 'react';
import cN from 'classnames';
import Reel from 'react-reel';
import s from './style.module.scss';
import rs from './reelstyle.module.scss';
import { MunicipalityContext } from '../../../context/Municipality';

const reelTheme = {
  reel: rs.reactReel__reel,
  group: rs.reactReel__group,
  number: rs.reactReel__number,
};

export const TickerMunicipality = () => {
  const { municipality } = useContext(MunicipalityContext);
  const [peopleCount, setPeopleCount] = useState(0);

  useEffect(() => {
    if (municipality && typeof municipality.signups === 'number') {
      setPeopleCount(municipality.signups);
    }
  }, [municipality]);

  return (
    <TickerDisplay
      prefixText="Schon"
      highlight1={peopleCount}
      inBetween1=""
      inBetween2="Menschen aus "
      highlight2={municipality?.name}
      inBetween3=" haben sich bei der Expedition Grundeinkommen angemeldet und holen so Grundeinkommen an ihren Wohnort."
      inviteText="Komm dazu."
      suffixHighlight2=""
    />
  );
};

const numberWithDots = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type TickerDisplayProps = {
  prefixText?: string;
  highlight1: number;
  inBetween1?: string;
  inBetween2?: string;
  highlight2?: number | string;
  suffixHighlight2?: string;
  tickerDescription?: string;
};

const TickerDisplay = ({
  prefixText,
  highlight1,
  inBetween1,
  inBetween2,
  highlight2,
  suffixHighlight2,
  tickerDescription,
}: TickerDisplayProps) => {
  return (
    <section className={s.contentContainer}>
      <div className={s.slotMachine}>
        <div className={s.counterContainer}>
          {prefixText && (
            <span
              className={cN(
                s.counterLabelSlotMachine,
                s.counterLabelMarginRight,
                s.bold
              )}
            >
              {prefixText}
            </span>
          )}

          <div className={s.numbersContainer}>
            <Reel text={numberWithDots(highlight1)} theme={reelTheme} />
          </div>

          {inBetween1 && (
            <h2
              className={cN(
                s.counterLabelSlotMachine,
                s.counterLabelMarginLeft
              )}
            >
              {inBetween1}
            </h2>
          )}
        </div>

        <div className={cN(s.counterContainer)}>
          {typeof highlight2 === 'number' && (
            <>
              {inBetween2 && (
                <h2
                  className={cN(
                    s.counterLabelSlotMachine,
                    s.counterLabelMarginRight
                  )}
                >
                  {inBetween2}
                </h2>
              )}
              <div className={s.numbersContainer}>
                <Reel text={numberWithDots(highlight2)} theme={reelTheme} />
              </div>

              {suffixHighlight2 && (
                <h2
                  className={cN(
                    s.counterLabelSlotMachine,
                    s.counterLabelMarginLeft
                  )}
                >
                  {suffixHighlight2}
                </h2>
              )}
            </>
          )}
          {typeof highlight2 === 'string' && (
            <>
              <h2
                className={cN(
                  s.counterLabelSlotMachine,
                  s.counterLabelMarginRight,
                  s.counterLabelLongText
                )}
              >
                {inBetween2 && <span>{inBetween2}</span>}
                <br />
                <span>{highlight2}{inBetween3}</span>
                <p className={s.inviteHeadline}>{inviteText}</p>
                {/* {suffixHighlight2 && <span>{suffixHighlight2}</span>} */}
              </h2>
            </>
          )}
        </div>
        {tickerDescription && (
          <p className={s.actionText}>{tickerDescription}</p>
        )}
      </div>
    </section>
  );
};

// Needed for lazy loading
export default TickerMunicipality;
