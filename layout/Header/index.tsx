import cN from 'classnames';
import { ReactElement, useEffect, useState } from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { Menu } from '../../utils/getMenus';
import { MainMenu } from './MainMenu/Desktop';
import { MainMenuMobile } from './MainMenu/Mobile';
import { HamburgerMenu } from './MainMenu/Mobile/HamburgerMenu';
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
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setIsMobile(width < 900);
  }, [width]);

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
          <MainMenuMobile
            mainMenu={mainMenu}
            currentRoute={currentRoute}
            closeMenu={() => setMobileMenuActive(false)}
          />
        </div>
      )}
    </>
  );
};
