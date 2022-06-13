import React, { ReactElement } from 'react';
import { Menu } from '../../../utils/getMenus';

type FooterMenuProps = {
  footerMenu: Menu;
};

export const FooterMenu = ({ footerMenu }: FooterMenuProps): ReactElement => {
  console.log(footerMenu);
  return <>{JSON.stringify(footerMenu)}</>;
};
