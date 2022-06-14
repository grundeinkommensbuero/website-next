import React, { ReactElement } from 'react';
import { Menu, MenuEntry } from '../../../utils/getMenus';
import { MenuLink } from '../../Header/MainMenu/MenuLink';

type FooterMenuProps = {
  footerMenu: Menu;
};

export const FooterMenu = ({ footerMenu }: FooterMenuProps): ReactElement => {
  const entries = footerMenu.filter(e => 'slug' in e) as MenuEntry[];
  return (
    <div>
      {entries.map(entry => (
        <MenuLink
          key={entry.slug}
          entry={entry}
          hoverUnderlineColor="WHITE"
          underlineColor="WHITE"
        />
      ))}
    </div>
  );
};
