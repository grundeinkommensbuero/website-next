import React, { useContext, useState, useEffect } from 'react';
import cN from 'classnames';
import Reel from 'react-reel';
import s from './style.module.scss';
import { MunicipalityContext } from '../../../context/Municipality';
import * as u from './utils';

import './reelstyle.scss';

type TickerProps = {
  tickerDescription?: string;
};

export const Ticker = ({ tickerDescription }: TickerProps) => {
  const { statsSummary, refreshContextStats } = useContext(MunicipalityContext);
  const [timerIsReady, setTimerIsReady] = useState<boolean>(false);
  const [peopleCount, setPeopleCount] = useState<number>(0);
  const [municipalityCount, setMunicipalityCount] = useState<number>(0);
  const [updatedSummary, setUpdatedSummary] = useState<number>(0);
  const [timePassedInIntervalInPercent, setTimePassedInIntervalInPercent] =
    useState<number>(0);

  useEffect(() => {
    if (statsSummary && statsSummary.previous) {
      const prevTimestamp = new Date(statsSummary?.previous.timestamp);
      const currTimestamp = new Date(statsSummary?.timestamp);

      u.calcTickerValues({
        prevTimestamp,
        currTimestamp,
        setTimePassedInIntervalInPercent,
      });
      setTimerIsReady(true);
      setUpdatedSummary(updatedSummary + 1);
    }
  }, [statsSummary]);

  useEffect(() => {
    let updateTickerTimeout: ReturnType<typeof setTimeout>;
    const timerConf = {
      numberBetweenOneAndThree: Math.floor(Math.random() * 3) + 1,
      interval: 3000,
    };
    // Set timer in a range of 3 to 9 seconds
    const randomTimer = timerConf.numberBetweenOneAndThree * timerConf.interval;
    if (
      statsSummary &&
      statsSummary.previous &&
      timerIsReady &&
      timePassedInIntervalInPercent <= 1
    ) {
      const prevTimestamp = new Date(statsSummary?.previous.timestamp);
      const currTimestamp = new Date(statsSummary?.timestamp);

      // Set timeout to display data in the Ticker Comp
      // console.log('Timer set to:', randomTimer, 'ms');
      updateTickerTimeout = setTimeout(() => {
        u.calcTickerValues({
          prevTimestamp,
          currTimestamp,
          setTimePassedInIntervalInPercent,
        });
      }, randomTimer);
    }
    // Clear Timeout when done
    return () => {
      clearTimeout(updateTickerTimeout);
    };
  }, [updatedSummary]);

  useEffect(() => {
    if (statsSummary && statsSummary.previous) {
      u.updateTicker({
        statsSummary,
        timePassedInIntervalInPercent,
        setPeopleCount,
        setMunicipalityCount,
        updatedSummary,
        setUpdatedSummary,
        refreshContextStats,
      });
    }
  }, [timePassedInIntervalInPercent]);

  return (
    <TickerDisplay
      prefixText="Schon"
      highlight1={peopleCount}
      inBetween1="Menschen in"
      // inBetween2="in"
      highlight2={municipalityCount}
      suffixHighlight2="Orten sind dabei."
      tickerDescription={tickerDescription}
    />
  );
};

type TickerDisplayProps = {
  prefixText?: string;
  highlight1: number;
  inBetween1?: string;
  inBetween2?: string;
  highlight2: number;
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
              {prefixText}{' '}
            </span>
          )}

          <div className={s.numbersContainer}>
            <Reel text={u.numberWithDots(highlight1)} />
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
          {typeof highlight2 !== 'string' && (
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
                <Reel text={u.numberWithDots(highlight2)} />
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
                  s.noMarginTop
                )}
              >
                {inBetween2 && <span>{inBetween2} </span>}
                <span className={s.highlightHeadline}>{highlight2}</span>
                {/* TODO: implement point */}
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
export default Ticker;
