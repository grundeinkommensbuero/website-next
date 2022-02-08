import { ReactElement } from 'react';
import { MainMenu, Menuentry } from './MainMenu';
import { PageLogo } from './PageLogo';

type HeaderProps = {
  mainmenu: Menuentry[];
};

export const Header = ({ mainmenu }: HeaderProps): ReactElement => {
  return (
    <div className='header bg-white sticky top-0 z-50'>
      <div className='mainMenu'>
        <div className='flex justify-between'>
          <PageLogo />
          <MainMenu mainmenu={mainmenu} />
        </div>
      </div>
    </div>
  );
};
