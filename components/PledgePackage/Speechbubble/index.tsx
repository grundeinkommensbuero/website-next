import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import SpeechbubbleTop from './speechbubble_top.svg';
import SpeechbubbleBottom from './speechbubble_bottom.svg';

type SpeechbubbleProps = {
  children: ReactElement;
  className?: string;
  isSmall?: boolean;
};

export const Speechbubble = ({
  children,
  className,
  isSmall = false,
}: SpeechbubbleProps) => {
  return (
    <div className={cN(s.container, className, { [s.small]: isSmall })}>
      <div className={cN(s.body)}>{children}</div>
      <SpeechbubbleTop className={cN(s.svg, s.svgTop)} />
      <SpeechbubbleBottom className={cN(s.svg, s.svgBottom)} />
    </div>
  );
};
