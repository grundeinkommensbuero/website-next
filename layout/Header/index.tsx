import { ReactElement } from 'react';
import { Menu } from '../../utils/getMenus';
import { MainMenu } from './MainMenu';
import { PageLogo } from './PageLogo';
import s from './style.module.scss';

type HeaderProps = {
  mainMenu: Menu;
  currentRoute: string;
};

export const Header = ({
  mainMenu,
  currentRoute,
}: HeaderProps): ReactElement => {
  return (
    <div className={s.header}>
      <div className={s.headerContent}>
        <PageLogo />
        <MainMenu mainMenu={mainMenu} currentRoute={currentRoute} />
      </div>
    </div>
  );
};
