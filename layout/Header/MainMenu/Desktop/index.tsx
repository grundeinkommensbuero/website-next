import { ReactElement } from 'react';
import { Dropdown, Menu, MenuEntry } from '../../../../utils/getMenus';
import { MenuLink } from '../MenuLink';
import { UserMenuLink } from '../UserMenuLink';
import s from '../style.module.scss';

type MainMenuProps = {
  mainMenu: Menu;
  currentRoute: string;
};

export const MainMenu = ({
  mainMenu,
  currentRoute,
}: MainMenuProps): ReactElement => {
  return (
    <div className="flex-row items-center">
      {mainMenu.map(entry => {
        if ((entry as Dropdown).entries)
          return (
            <div key={entry.id} className={s.dropdown}>
              <span className="mx-2 text-xl nowrap">{entry.label}</span>
              <div className={s.dropdownContent}>
                <>
                  {(entry as Dropdown).entries.map(entry => {
                    return (
                      <div className="my-4" key={entry.slug}>
                        <MenuLink entry={entry} currentRoute={currentRoute} />
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
          );
        return (
          <MenuLink
            entry={entry as MenuEntry}
            key={(entry as MenuEntry).slug}
            currentRoute={currentRoute}
          />
        );
      })}
      <UserMenuLink
        entry={{ id: 'login', slug: 'login', label: 'Einloggen' }}
        currentRoute={currentRoute}
      />
    </div>
  );
};
