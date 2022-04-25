import React, { ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import {
  LinkButton,
  Button,
  LinkButtonLocal,
  ButtonType,
  ButtonSize,
} from '../Button';
import POINT_LEFT_YELLOW from './figure_point_left_yellow.svg';
import POINT_LEFT_MOBILE_YELLOW from './figure_point_left_mobile_yellow.svg';
import POINT_LEFT_RED from './figure_point_left_red.svg';
import POINT_LEFT_MOBILE_RED from './figure_point_left_mobile_red.svg';

type CTAButtonsProps = {
  children: ReactElement | ReactElement[];
};

export const CTAButtons = ({ children }: CTAButtonsProps) => (
  <div className={s.buttons}>{children}</div>
);

type CTAButtonContainerProps = {
  children: ReactElement | ReactElement[];
  className?: string;
  illustration?: string;
};

export function CTAButtonContainer({
  children,
  className,
  illustration,
}: CTAButtonContainerProps) {
  return (
    <div
      className={cN(s.container, className, {
        [s.hasIllustration]: illustration,
      })}
    >
      <div className={s.inner}>
        {children}
        {illustration === 'POINT_LEFT' && (
          <>
            <img
              alt=""
              src={POINT_LEFT_YELLOW}
              className={cN(s.illustrationPointLeft, s.yellow)}
              aria-hidden="true"
            />
            <img
              alt=""
              src={POINT_LEFT_MOBILE_YELLOW}
              className={cN(s.illustrationPointLeftMobile, s.yellow)}
              aria-hidden="true"
            />
            <img
              alt=""
              src={POINT_LEFT_RED}
              className={cN(s.illustrationPointLeft, s.red)}
              aria-hidden="true"
            />
            <img
              alt=""
              src={POINT_LEFT_MOBILE_RED}
              className={cN(s.illustrationPointLeftMobile, s.red)}
              aria-hidden="true"
            />
          </>
        )}
        {illustration === 'POINT_RIGHT' && (
          <>
            <img
              alt=""
              src={POINT_LEFT_YELLOW}
              className={cN(s.illustrationPointRight, s.yellow)}
              aria-hidden="true"
            />
            <img
              alt=""
              src={POINT_LEFT_RED}
              className={cN(s.illustrationPointRight, s.red)}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </div>
  );
}

type CTAButtonProps = {
  children: ReactElement | string;
  className?: string;
  onClick?: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  other?: any;
};

export function CTAButton({
  children,
  className,
  size,
  ...other
}: CTAButtonProps) {
  return (
    <Button className={cN(s.button, className)} {...other}>
      {children}
    </Button>
  );
}

type CTALinkProps = {
  children: ReactElement | string;
  className?: string;
  to?: string;
  other?: any;
};

export function CTALink({ children, className, ...other }: CTALinkProps) {
  return (
    <LinkButtonLocal className={cN(s.button, className)} {...other}>
      {children}
    </LinkButtonLocal>
  );
}

type CTALinkExternalProps = {
  children: ReactElement | string;
  href: string;
  className?: string;
  onClick?: () => void;
  other?: any;
};

export function CTALinkExternal({
  children,
  href,
  className,
  onClick,
  ...other
}: CTALinkExternalProps) {
  return (
    <LinkButton
      target={href.startsWith('#') ? '' : '_blank'}
      className={cN(className, s.button)}
      href={href}
      onClick={() => {
        if (href.startsWith('#')) {
          dispatchEvent(href);
        }
      }}
      {...other}
    >
      {children}
    </LinkButton>
  );
}

function dispatchEvent(id: string) {
  window.dispatchEvent(new Event(id));
}
