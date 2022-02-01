import { ReactElement } from 'react';
import { MainMenu, Menuentry } from './MainMenu';
import { PageLogo } from './PageLogo';

type HeaderProps = {
  mainmenu: Menuentry[];
};

export const Header = ({ mainmenu }: HeaderProps): ReactElement => {
  return (
    <div className='bg-white px-8 h-16 flex justify-between sticky top-0 z-50'>
      <PageLogo />
      <MainMenu mainmenu={mainmenu} />
    </div>
  );
};
