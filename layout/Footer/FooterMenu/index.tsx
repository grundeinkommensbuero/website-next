import React, { ReactElement } from 'react';
import { Menu, MenuEntry } from '../../../utils/getMenus';
import { MenuLink } from '../../Header/MainMenu/MenuLink';
import s from '../style.module.scss';

type FooterMenuProps = {
  footerMenu: Menu;
};

export const FooterMenu = ({ footerMenu }: FooterMenuProps): ReactElement => {
  const entries = footerMenu.filter(e => 'slug' in e) as MenuEntry[];
  return (
    <ul className={s.footerMenuRow}>
      {entries.map(entry => (
        <li key={entry.slug}>
          <MenuLink
            entry={entry}
            hoverUnderlineColor="WHITE"
            underlineColor="WHITE"
          />
        </li>
      ))}
    </ul>
  );
};
