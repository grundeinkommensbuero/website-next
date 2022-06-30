import React from 'react';
import Flowers from './flowers.svg';
import Hat from './hat.svg';
import Crowd1 from './crowd1.svg';
import Crowd2 from './crowd2.svg';
import Crowd1Red from './crowd1_red.svg';
import Crowd2Red from './crowd2_red.svg';
import s from './style.module.scss';
import cN from 'classnames';

export const HurrayCrowd = ({
  color,
  small,
}: {
  color?: string;
  small?: boolean;
}) => (
  <div className={cN(s.savedStage, { [s.small]: small })}>
    <Flowers className={s.savedStageFlowers} alt="" />
    <Hat className={s.savedStageHat} alt="" />
    {color === 'RED' ? (
      <>
        <Crowd1Red className={s.savedStageCrowd1} alt="" />
        <Crowd2Red className={s.savedStageCrowd2} alt="" />
      </>
    ) : (
      <>
        <Crowd1 className={s.savedStageCrowd1} alt="" />
        <Crowd2 className={s.savedStageCrowd2} alt="" />
      </>
    )}
  </div>
);
