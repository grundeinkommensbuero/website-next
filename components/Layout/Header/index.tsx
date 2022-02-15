import { ReactElement } from 'react';
import { Mainmenu } from '../../../utils/getMenus';
import { MainMenu } from './MainMenu';
import { PageLogo } from './PageLogo';
import s from './style.module.scss';

type HeaderProps = {
  mainmenu: Mainmenu;
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
