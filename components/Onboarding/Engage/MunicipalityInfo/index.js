import React, { useState, useEffect } from 'react';
import cN from 'classnames';
import * as s from './style.module.less';

export const MunicipalityInfo = ({
  start = 0,
  end = 0,
  goal = 0,
  title,
  description,
}) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [displayWidth, setDisplayWidth] = useState(0);

  // calulate percantage to derive progress bar style before animation
  const finalPercentage = Math.round((end / goal) * 100) || 0;

  const time = 1000;
  const INTERVALL = 50;

  useEffect(() => {
    // count up number of people
    calculateSteps(start, end, displayCount, setDisplayCount);
    // count up display width in percent
    calculateSteps(start, finalPercentage, displayWidth, setDisplayWidth);
  }, [end]);

  const calculateSteps = (start, end, count, setFn) => {
    const startFrom = start;
    const distance = end - startFrom;
    if (end !== count) {
      const rounds = Math.round(time / INTERVALL);
      for (let round = 0; round <= rounds; round++) {
        setTimeout(() => {
          setFn(Math.round((round / rounds) * distance) + startFrom);
        }, (round / rounds) * time);
      }
    }
  };

  return (
    <div className={s.municipalityInfoContainer}>
      {title ? <h4 className={s.ProgressBarTitle}>{title}</h4> : null}
      <div className={s.progressBarContainer}>
        {/* goal bar */}
        <span className={cN(s.barGoal)}>
          <div className={s.barGoalBar}>
            <div
              className={cN(
                { [s.barGoalInbetween]: finalPercentage <= 100 },
                { [s.barGoalReached]: finalPercentage > 100 }
              )}
            >
              <span className={s.goalLabel}>{goal}</span>
            </div>
          </div>
        </span>
        {/* actual status bar */}
        <div
          className={cN(
            s.barCurrent,
            { [s.outside]: finalPercentage < 25 },
            { [s.barAlmostFull]: finalPercentage > 95 },
            { [s.completed]: true }
          )}
          style={{ width: `${displayWidth < 100 ? displayWidth : 100}%` }}
          aria-label={`${displayCount}`}
        >
          <span className={s.barCurrentLabel}>{displayCount}</span>
        </div>
      </div>
      {description ? (
        <p className={s.progressBarDescription}>
          {displayCount}/{goal} {description}
        </p>
      ) : null}
    </div>
  );
};
