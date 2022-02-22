import React, { ReactElement } from 'react';
import cN from 'classnames';

import s from './style.module.scss';
import Link from 'next/link';

type MenuItemParentProps = {
  title: string;
  children: ReactElement;
  internalLink?: string;
  externalLink?: string;
};

export const MenuItemParent = ({
  title,
  children,
  internalLink,
  externalLink,
}: MenuItemParentProps): ReactElement => {
  return (
    <div className={cN({ [s.navItemParent]: true }, s.navItem)}>
      {!internalLink && !externalLink && (
        <a className={cN('mx-2 text-xl')}>{title}</a>
      )}
      {internalLink && (
        <Link
          href={
            // Apperently this prop is getting prefixed in the client, but
            // not on the server. Until fixed this workaround helps:
            internalLink.substring(0, 1) === '/'
              ? internalLink
              : `/${internalLink}`
          }
        >
          <a
            className="mx-2 text-2xl"
            aria-label={`Zu ${
              internalLink === '/' ? 'Start' : internalLink
            } navigieren`}
          >
            {title}
          </a>
        </Link>
      )}
      {externalLink && (
        <a
          className={s.link}
          href={externalLink}
          rel="noreferrer"
          target="_blank"
        >
          {title}
        </a>
      )}
      {children && (
        <div className={s.menuItemParentChildren}>
          <ul className={s.menuItemParentChildrenInner}>{children}</ul>
        </div>
      )}
    </div>
  );
};
