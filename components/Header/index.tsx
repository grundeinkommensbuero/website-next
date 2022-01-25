import { ReactElement } from 'react';
import { MainMenu } from './MainMenu';
import { PageLogo } from './PageLogo';

export const Header = (): ReactElement => {
  return (
    <div className='bg-white px-8 h-16 flex justify-between'>
      <PageLogo />
      <MainMenu />
    </div>
  );
};
