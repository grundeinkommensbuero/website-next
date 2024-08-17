import { ReactElement } from 'react';
import { Dropdown, Menu, MenuEntry } from '../../../../utils/getMenus';
import { MenuLink } from '../MenuLink';
import { UserMenuLinkMobile } from './UserMenuLinkMobile';
import { LinkButton } from '../../../../components/Forms/Button';
import cN from 'classnames';
import s from '../style.module.scss';
import { getLoginNextPageParam } from '../Desktop';

const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

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
      className={cN(
        'flex-column',
        'items-start',
        s.nav,
        s.mobileMenuContainer,
        { [s.hamburg]: IS_HAMBURG_PROJECT },
        { colorSchemeHamburgBlackOnOrange: IS_HAMBURG_PROJECT }
      )}
    >
      <ul>
        {IS_HAMBURG_PROJECT ? (
          <>
            <li className={cN({ 'my-10': IS_HAMBURG_PROJECT })}>
              <LinkButton href="/briefeintragung">
                Jetzt unterschreiben!
              </LinkButton>
            </li>
            <li className={cN({ 'my-10': IS_HAMBURG_PROJECT })}>
              <LinkButton href="/sammeln">Jetzt mitsammeln!</LinkButton>
            </li>
          </>
        ) : (
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
        )}
        {mainMenu.map((entry, index) => {
          if ((entry as Dropdown).entries)
            return (
              <li key={index}>
                <span className="my-2 nowrap">{entry.label}</span>
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
            <li
              className={cN(
                { 'my-2': !IS_HAMBURG_PROJECT },
                { 'my-10': IS_HAMBURG_PROJECT }
              )}
              key={(entry as MenuEntry).slug}
            >
              <MenuLink
                entry={entry as MenuEntry}
                currentRoute={currentRoute}
                isMobile={true}
                extraCallback={closeMenu}
              />
            </li>
          );
        })}
      </ul>
      {IS_HAMBURG_PROJECT ? '' : ''}
    </nav>
  );
};
