import React, { ReactElement, useEffect, useRef } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { ColorScheme } from '../../Section';
// import { HurrayCrowd } from '../../HurrayCrowd';
import { scrollIntoView } from '../../../utils/scrollIntoView';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type FinallyMessageProps = {
  loading?: boolean;
  children: ReactElement | ReactElement[] | string;
  className?: string;
  preventScrolling?: boolean;
  colorScheme?: ColorScheme;
};

export const FinallyMessage = ({
  loading,
  children,
  className,
  preventScrolling,
  colorScheme = IS_BERLIN_PROJECT ? 'colorSchemeRose' : 'colorSchemeViolet',
}: FinallyMessageProps) => {
  useEffect(() => {
    if (!preventScrolling) {
      scrollIntoView(messageRef.current);
    }
    // eslint-disable-next-line
  }, []);
  const messageRef = useRef(null);

  return (
    <div className={className}>
      <div className={cN(s.message, colorScheme)} ref={messageRef}>
        <div className={cN(s.messageInner)}>
          {loading && <div className={s.loadingIndicator} />}
          <div className={s.children}>{children}</div>
        </div>
      </div>
    </div>
  );
};
