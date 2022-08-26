import { ReactElement } from 'react';
import { Dropdown, Menu, MenuEntry } from '../../../../utils/getMenus';
import { MenuLink } from '../MenuLink';
import { UserMenuLinkMobile } from './UserMenuLinkMobile';
import cN from 'classnames';
import s from '../style.module.scss';
import { getLoginNextPageParam } from '../Desktop';

type MainMenuMobileProps = {
  mainMenu: Menu;
  currentRoute: string;
  closeMenu: () => void;
};

export const MainMenuMobile = ({
  mainMenu,
  currentRoute,
  closeMenu,
}: MainMenuMobileProps): ReactElement => {
  return (
    <nav
      className={cN('flex-column', 'items-start', s.nav, s.mobileMenuContainer)}
    >
      <ul>
        {mainMenu.map((entry, index) => {
          if ((entry as Dropdown).entries)
            return (
              <li key={index}>
                <span className="my-2 text-xl nowrap">{entry.label}</span>
                <div className="mx-4">
                  <ul>
                    {(entry as Dropdown).entries.map(entry => {
                      return (
                        <li className="my-4" key={entry.slug}>
                          <MenuLink
                            entry={entry}
                            currentRoute={currentRoute}
                            isMobile={true}
                            extraCallback={closeMenu}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          return (
            <li className="my-2" key={(entry as MenuEntry).slug}>
              <MenuLink
                entry={entry as MenuEntry}
                currentRoute={currentRoute}
                isMobile={true}
                extraCallback={closeMenu}
              />
            </li>
          );
        })}
        <li>
          <UserMenuLinkMobile
            entry={{
              id: 'login',
              slug: `login${getLoginNextPageParam(currentRoute)}`,
              label: 'Einloggen',
            }}
            currentRoute={currentRoute}
            extraCallback={closeMenu}
          />
        </li>
      </ul>
    </nav>
  );
};
