import React, { ReactElement, useEffect, useRef } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { ColorScheme } from '../../Section';
// import { HurrayCrowd } from '../../HurrayCrowd';
import { scrollIntoView } from '../../../utils/scrollIntoView';

type Color = 'white' | 'red' | 'aqua' | 'violet';

type FinallyMessageProps = {
  state?: string;
  children: ReactElement | ReactElement[] | string;
  className?: string;
  preventScrolling?: boolean;
  color?: Color;
};

export const FinallyMessage = ({
  state,
  children,
  className,
  preventScrolling,
  color = 'violet',
}: FinallyMessageProps) => {
  useEffect(() => {
    if (!preventScrolling) {
      scrollIntoView(messageRef.current);
    }
    // eslint-disable-next-line
  }, []);
  const messageRef = useRef(null);

  const getColorSchmeme = (color: Color): ColorScheme => {
    switch (color) {
      case 'violet':
        return 'colorSchemeViolet';
      case 'white':
        return 'colorSchemeWhite';
      case 'aqua':
        return 'colorSchemeAqua';
      case 'red':
        return 'colorSchemeRed';
      default:
        return 'colorSchemeWhite';
    }
  };

  return (
    <div className={className}>
      {/* {state === 'success' && <HurrayCrowd />} */}
      <div className={cN(s.message, getColorSchmeme(color))} ref={messageRef}>
        <div className={cN(s.messageInner)}>
          {state === 'progress' && <div className={s.savingIndicator} />}
          <div className={s.children}>{children}</div>
        </div>
      </div>
    </div>
  );
};
