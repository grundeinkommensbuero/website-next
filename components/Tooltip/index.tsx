import React, { CSSProperties, ReactElement } from 'react';
import s from './style.module.scss';
import { Manager, Reference, Popper, PopperProps } from 'react-popper';
import cN from 'classnames';
import { Style } from 'util';

type TooltipProps = {
  children: ReactElement | string;
  style?: CSSProperties;
  className?: string;
  content: string;
  /* TODO: Find out, how PopperJS types work */
  placement?: any;
  popupClassName?: string;
};

export const Tooltip = ({
  children,
  style,
  className,
  content,
  placement = 'top',
  popupClassName,
}: TooltipProps) => {
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} style={style} className={cN(className, s.content)}>
            {children}
          </div>
        )}
      </Reference>
      <Popper placement={placement}>
        {({ ref, style, placement, arrowProps }) => (
          <div
            ref={ref}
            style={style}
            data-placement={placement}
            className={s.popup}
          >
            <div className={cN(popupClassName, s.tooltipContent)}>
              {content}
            </div>
            <div
              ref={arrowProps.ref}
              style={arrowProps.style}
              data-placement={placement}
              className={s.arrow}
            />
          </div>
        )}
      </Popper>
    </Manager>
  );
};
