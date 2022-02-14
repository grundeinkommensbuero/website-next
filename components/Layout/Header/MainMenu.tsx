import Link from 'next/link';
import { ReactElement } from 'react';
import { MenuElement } from '../../../utils/getMenus';
import { MenuItemParent } from './Menu/MenuItemParent';

type MainMenuProps = {
  mainmenu: MenuElement[];
};

export const MainMenu = ({ mainmenu }: MainMenuProps): ReactElement => {
  return (
    <div className='py-6 flex-row'>
      {mainmenu.map((entry) => {
        if (!entry.entries) return <MenuLink entry={entry} key={entry.slug} />;

        return (
          <MenuItemParent title={entry.label} key={entry.slug + entry.id}>
            <>
              {entry.entries.map((entry) => {
                if (typeof entry.menuentry_id !== 'number')
                  return (
                    <div key={entry.menuentry_id.slug}>
                      <MenuLink entry={entry.menuentry_id} />
                    </div>
                  );
              })}
            </>
          </MenuItemParent>
        );
      })}
    </div>
  );
};

const MenuLink = ({ entry }: { entry: MenuElement }) => {
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
