import { ReactElement } from 'react';
import { MainMenu, Menuentry } from './MainMenu';
import { PageLogo } from './PageLogo';
import s from './style.module.scss';

type HeaderProps = {
  mainmenu: Menuentry[];
};

export const Header = ({ mainmenu }: HeaderProps): ReactElement => {
  return (
    <div className={s.header}>
      <div className={s.mainMenu}>
        <PageLogo />
        <MainMenu mainmenu={mainmenu} />
      </div>
    </div>
  );
};
