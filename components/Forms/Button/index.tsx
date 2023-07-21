import React, { ReactElement, Ref } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import Link from 'next/link';
import SuccessIconStandard from './success.svg';
import SuccessIconBerlin from './success-rosa.svg';

export type ButtonSize = 'MEDIUM' | 'SMALL';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

const SuccessIcon = IS_BERLIN_PROJECT ? SuccessIconBerlin : SuccessIconStandard;

type LinkButtonProps = {
  children: ReactElement | string;
  className?: string;
  size?: ButtonSize;
  target?: string;
  href?: string;
  onClick?: () => void;
};

export function LinkButton({
  children,
  className,
  size,
  target,
  href,
  ...other
}: LinkButtonProps) {
  return (
    <a
      href={href}
      target={target}
      className={cN(
        s.linkButton,
        className,
        { [s.medium]: size === 'MEDIUM' },
        { [s.hamburg]: IS_HAMBURG_PROJECT }
      )}
      {...other}
    >
      {children}
    </a>
  );
}

type LinkButtonLocalProps = {
  children: ReactElement | string;
  className?: string;
  size?: ButtonSize;
  to?: string;
  [other: string]: any;
};

export function LinkButtonLocal({
  children,
  className,
  size,
  to = '/',
  ...other
}: LinkButtonLocalProps) {
  return (
    <div
      className={cN(s.linkButton, className, {
        [s.hamburg]: IS_HAMBURG_PROJECT,
      })}
      {...other}
    >
      <Link href={to}>{children}</Link>
    </div>
  );
}

export type ButtonType = 'button' | 'submit' | 'reset' | undefined;

type ButtonProps = {
  children: ReactElement | ReactElement[] | string;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  customRef?: Ref<any>;
  loading?: boolean;
  success?: boolean;
  onClick?: (e?: any) => void;
  type?: ButtonType;
  name?: string;
  tabIndex?: number;
  id?: string;
};

export function Button({
  children,
  className,
  disabled,
  size,
  customRef,
  loading,
  success,
  onClick,
  type = 'button',
  name,
  tabIndex,
  id,
}: ButtonProps) {
  return (
    <>
      <button
        className={cN(
          s.button,
          className,
          { [s.hamburg]: IS_HAMBURG_PROJECT },
          { [s.medium]: size === 'MEDIUM' },
          // Only use small buttons as exception!
          { [s.small]: size === 'SMALL' },
          { [s.disabled]: disabled },
          { [s.loading]: loading },
          { [s.success]: success }
        )}
        ref={customRef}
        disabled={disabled}
        onClick={onClick}
        type={type}
        name={name}
        tabIndex={tabIndex}
        id={id}
      >
        <div className={s.buttonText}>{children}</div>
        <div className={s.progressBar}></div>

        <div className={s.successIcon}>
          <SuccessIcon alt="Illustration des Erfolgs" />
        </div>
      </button>
    </>
  );
}

type InlineButtonProps = {
  children: ReactElement | string;
  className?: string;
  onClick: (e: any) => void;
  size?: ButtonSize;
  customRef?: Ref<any>;
  loading?: boolean;
  success?: boolean;
  other?: any;
  type?: string;
};

export function InlineButton({
  children,
  onClick,
  className,
  ...other
}: InlineButtonProps) {
  return (
    <span
      tabIndex={0}
      role="button"
      className={cN(s.inlineButton, className)}
      onKeyDown={e => {
        // Emulate click when enter or space are pressed
        if (e.key === 'Enter' || e.key === ' ') onClick(e);
      }}
      onClick={onClick}
      {...other}
    >
      {children}
    </span>
  );
}

type InlineLinkButtonProps = {
  children: ReactElement | string;
  className?: string;
  href?: string;
  [other: string]: any;
};

export function InlineLinkButton({
  children,
  className,
  href,
  ...other
}: InlineLinkButtonProps) {
  return (
    <a
      tabIndex={0}
      role="button"
      href={href}
      className={cN(s.inlineButton, className)}
      {...other}
    >
      {children}
    </a>
  );
}

type PrimarySecondaryButtonContainerProps = {
  children: ReactElement | ReactElement[];
  className?: string;
  size?: ButtonSize;
};

export function PrimarySecondaryButtonContainer({
  children,
  className,
  size,
  ...other
}: PrimarySecondaryButtonContainerProps) {
  return (
    <div className={cN(s.primarySecondaryButtonContainer, className)}>
      {children}
    </div>
  );
}

type DropdownButtonProps = {
  children: ReactElement | string;
  className?: string;
  isActive?: boolean;
  isOpen?: boolean;
  onClick: (e: any) => void;
};

export function DropdownButton({
  children,
  isActive,
  isOpen,
  onClick,
  className,
  ...other
}: DropdownButtonProps) {
  return (
    <span
      tabIndex={0}
      role="button"
      className={cN(s.dropdownButton, className, { [s.active]: isActive })}
      onKeyDown={e => {
        // Emulate click when enter or space are pressed
        if (e.key === 'Enter' || e.key === ' ') onClick(e);
      }}
      onClick={onClick}
      {...other}
    >
      {children}
      <div
        className={cN(s.triangle, {
          [s.animateTriangle]: isOpen,
        })}
      ></div>
    </span>
  );
}
