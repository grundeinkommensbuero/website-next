import Link from 'next/link';
import { ReactElement } from 'react';
import { Dropdown, Mainmenu, MenuEntry } from '../../../utils/getMenus';
import { MenuItemParent } from './Menu/MenuItemParent';

type MainMenuProps = {
  mainmenu: Mainmenu;
};

export const MainMenu = ({ mainmenu }: MainMenuProps): ReactElement => {
  return (
    <div className='py-6 flex-row'>
      {mainmenu.map((entry) => {
        if ((entry as Dropdown).entries)
          return (
            <MenuItemParent title={entry.label} key={entry.id}>
              <>
                {(entry as Dropdown).entries.map((entry) => {
                  return (
                    <div className='mb-4' key={entry.slug}>
                      <MenuLink entry={entry} />
                    </div>
                  );
                })}
              </>
            </MenuItemParent>
          );
        return (
          <MenuLink
            entry={entry as MenuEntry}
            key={(entry as MenuEntry).slug}
          />
        );
      })}
    </div>
  );
};

const MenuLink = ({ entry }: { entry: MenuEntry }) => {
  return (
    <Link
      key={entry.id}
      href={
        // Apperently this prop is getting prefixed in the client, but
        // not on the server. Until fixed this workaround helps:
        entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`
      }>
      <a
        className='mx-2 text-2xl'
        aria-label={`Zu ${
          entry.slug === '/' ? 'Start' : entry.slug
        } navigieren`}>
        {entry.label}
      </a>
    </Link>
  );
};
