import { ReactElement } from 'react';
import { Dropdown, Menu, MenuEntry } from '../../../../utils/getMenus';
import { MenuLink } from '../MenuLink';
import { UserMenuLinkMobile } from './UserMenuLinkMobile';

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
    <div className="flex-column items-start">
      {mainMenu.map((entry, index) => {
        if ((entry as Dropdown).entries)
          return (
            <div key={index}>
              <span className="my-2 text-xl nowrap">{entry.label}</span>
              <div className="mx-4">
                {(entry as Dropdown).entries.map(entry => {
                  return (
                    <div className="my-4" key={entry.slug}>
                      <MenuLink
                        entry={entry}
                        currentRoute={currentRoute}
                        isMobile={true}
                        extraCallback={closeMenu}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        return (
          <MenuLink
            entry={entry as MenuEntry}
            key={(entry as MenuEntry).slug}
            currentRoute={currentRoute}
            isMobile={true}
            extraCallback={closeMenu}
          />
        );
      })}
      <UserMenuLinkMobile
        entry={{ id: 'login', slug: 'login', label: 'Einloggen' }}
        currentRoute={currentRoute}
        extraCallback={closeMenu}
      />
    </div>
  );
};
