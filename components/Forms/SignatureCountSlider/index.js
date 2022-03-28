import React from 'react';
import s from './style.module.scss';
import { TextInputInline } from '../TextInput';
import cN from 'classnames';
import { shuffle } from '../../utils';

const HAND_ILLUSTRATIONS = [
  require('./hand_1.svg'),
  require('./hand_2.svg'),
  require('./hand_3.svg'),
  require('./hand_4.svg'),
  require('./hand_5.svg'),
  require('./hand_6.svg'),
];

const MAX_HANDS = 100;
const MAX_TILT = 10;

const HANDS_ARRAY = Array.apply(null, Array(MAX_HANDS)).map((hand, index) => {
  return {
    hand: Math.floor(Math.random() * HAND_ILLUSTRATIONS.length),
    tilt: Math.round(Math.random() * MAX_TILT),
    position: (1 / MAX_HANDS) * index,
    size: Math.random(),
  };
});

shuffle(HANDS_ARRAY);

HANDS_ARRAY.unshift({
  hand: Math.floor(Math.random() * HAND_ILLUSTRATIONS.length),
  tilt: Math.round(Math.random() * MAX_TILT),
  position: 0.75,
  size: Math.random(),
});

HANDS_ARRAY.unshift({
  hand: 1,
  tilt: Math.round(Math.random() * MAX_TILT),
  position: 0.25,
  size: Math.random(),
});

export const SignatureCountSlider = ({
  input,
  label,
  labelHidden,
  min,
  max,
  hide,
}) => {
  if (hide) {
    return null;
  }

  return (
    <>
      <label htmlFor={`slider_${input.name}`}>{label}</label>
      <div className={s.inputContainer}>
        <div className={s.sliderContainer}>
          <input
            className={s.input}
            id={`slider_${input.name}`}
            min={min}
            max={max}
            aria-label={label || labelHidden}
            {...input}
          />
        </div>
        <TextInputInline
          type="number"
          min={min}
          max={max}
          name={input.name}
          value={input.value}
          onBlur={input.onBlur}
          onChange={input.onChange}
          className={s.textInput}
          aria-label={label || labelHidden}
        />
      </div>
      <div
        className={cN(s.stage, {
          [s.many]: input.value > 50,
          [s.more]: input.value > 75,
        })}
        aria-hidden="true"
      >
        <div className={s.stageInner}>
          <div className={s.stageInnerInner}>
            {HANDS_ARRAY.map((hand, index) => (
              <Hand key={index} index={index} hand={hand} count={input.value} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Hand = ({ index, hand, count }) => {
  if (count < index + 1) {
    return null;
  }
  let style;
  let side;
  let position;

  if (hand.position < 0.5) {
    side = 'left';
    position = hand.position / 0.5;
  } else {
    side = 'right';
    position = (hand.position - 0.5) / 0.5;
  }

  if (side === 'bottom') {
    style = { left: position * 100 + '%' };
  } else {
    style = { bottom: position * 100 + '%' };
  }

  return (
    <div
      style={style}
      className={cN(s.handContainer, s[`handContainer_${side}`])}
    >
      <img
        className={s.hand}
        src={HAND_ILLUSTRATIONS[hand.hand]}
        style={{ transform: `translateY(${hand.size * -2}rem)` }}
        alt=""
      />
    </div>
  );
};
