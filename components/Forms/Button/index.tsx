import React, { ReactElement, Ref } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import Link from 'next/link';
import successIcon from './success.svg';
import { MoveEvent } from 'sortablejs';

type Size = 'MEDIUM' | 'SMALL';

type LinkButtonProps = {
  children: ReactElement | string;
  className?: string;
  size?: Size;
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
  onClick,
  ...other
}: LinkButtonProps) {
  return (
    <a
      className={cN(s.linkButton, className, { [s.medium]: size === 'MEDIUM' })}
      {...other}
    >
      {children}
    </a>
  );
}

type LinkButtonLocalProps = {
  children: ReactElement | string;
  className?: string;
  size?: Size;
};

export function LinkButtonLocal({
  children,
  className,
  size,
  ...other
}: LinkButtonLocalProps) {
  return (
    <div
      className={cN(s.linkButton, className, { [s.medium]: size === 'MEDIUM' })}
      {...other}
    >
      <Link href="">{children}</Link>
    </div>
  );
}

type ButtonProps = {
  children: ReactElement | string;
  className?: string;
  disabled?: boolean;
  size?: Size;
  customRef?: Ref<any>;
  loading?: boolean;
  success?: boolean;
  onClick?: (e: any) => void;
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
}: ButtonProps) {
  return (
    <>
      <button
        className={cN(
          s.button,
          className,
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
      >
        <div className={s.buttonText}>{children}</div>
        {/* <div className={s.progressBar}></div>

        <div className={s.successIcon}>
          <img alt="Illustration des Erfolgs" src={successIcon} />
        </div> */}
      </button>
    </>
  );
}

type InlineButtonProps = {
  children: ReactElement | string;
  className?: string;
  onClick: (e: any) => void;
  size?: Size;
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
  children: ReactElement;
  className?: string;
};

export function InlineLinkButton({
  children,
  className,
  ...other
}: InlineLinkButtonProps) {
  return (
    <a
      tabIndex={0}
      role="button"
      className={cN(s.inlineButton, className)}
      {...other}
    >
      {children}
    </a>
  );
}

type PrimarySecondaryButtonContainerProps = {
  children: ReactElement;
  className?: string;
  size?: Size;
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
  children: ReactElement;
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
