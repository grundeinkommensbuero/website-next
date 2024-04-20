import { ReactElement } from 'react';
import { Dropdown, Menu, MenuEntry } from '../../../../utils/getMenus';
import { MenuLink } from '../MenuLink';
import { UserMenuLink } from '../UserMenuLink';
import { LinkButton } from '../../../../components/Forms/Button';
import s from '../style.module.scss';
import cN from 'classnames';

const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

type MainMenuProps = {
  mainMenu: Menu;
  currentRoute: string;
};

export const MainMenu = ({
  mainMenu,
  currentRoute,
}: MainMenuProps): ReactElement => {
  return (
    <nav className={cN([s.nav], { [s.hamburg]: IS_HAMBURG_PROJECT })}>
      <ul className={cN('flex-row', 'items-center')}>
        {mainMenu.map(entry => {
          if ((entry as Dropdown).entries)
            return (
              <li key={entry.id} className={s.dropdown}>
                <span className="mx-2 nowrap">{entry.label}</span>
                <div className={s.dropdownContent}>
                  <ul>
                    <>
                      {(entry as Dropdown).entries.map(entry => {
                        return (
                          <li className="my-4" key={entry.slug}>
                            <MenuLink
                              entry={entry}
                              currentRoute={currentRoute}
                            />
                          </li>
                        );
                      })}
                    </>
                  </ul>
                </div>
              </li>
            );
          return (
            <li key={(entry as MenuEntry).slug}>
              <MenuLink
                entry={entry as MenuEntry}
                currentRoute={currentRoute}
              />
            </li>
          );
        })}
        {IS_HAMBURG_PROJECT ? (
          <li>
            <LinkButton href="/#spenden">Jetzt spenden!</LinkButton>
          </li>
        ) : (
          <li>
            <UserMenuLink
              entry={{
                id: 'login',
                slug: `login${getLoginNextPageParam(currentRoute)}`,
                label: 'Einloggen',
              }}
              currentRoute={currentRoute}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};

export const getLoginNextPageParam = (currentRoute: string) => {
  return currentRoute !== '/'
    ? `/?nextPage=${encodeURIComponent(
        currentRoute.slice(-1) === '/'
          ? currentRoute.slice(1, -1)
          : currentRoute.slice(1)
      )}`
    : '';
};
