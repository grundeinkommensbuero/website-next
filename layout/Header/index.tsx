import cN from 'classnames';
import { ReactElement, useState } from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { Menu } from '../../utils/getMenus';
import { MainMenu, MainMenuMobile } from './MainMenu';
import { HamburgerMenu } from './MainMenu/HamburgerMenu';
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
  const [mobileMenuActive, setMobileMenuActive] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  return (
    <>
      <div className={s.header}>
        <div className={s.headerContent}>
          <PageLogo />
          {!isMobile ? (
            <MainMenu mainMenu={mainMenu} currentRoute={currentRoute} />
          ) : (
            <HamburgerMenu
              isActive={mobileMenuActive}
              setIsActive={setMobileMenuActive}
            />
          )}
        </div>
      </div>
      {isMobile && mobileMenuActive && (
        <div className={cN(s.mobileMenu)}>
          <MainMenuMobile mainMenu={mainMenu} currentRoute={currentRoute} />
        </div>
      )}
    </>
  );
};
