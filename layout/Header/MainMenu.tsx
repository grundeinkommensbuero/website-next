import Link from 'next/link';
import { ReactElement } from 'react';
import { Dropdown, Mainmenu, MenuEntry } from '../../utils/getMenus';
import s from './style.module.scss';

type MainMenuProps = {
  mainmenu: Mainmenu;
  currentRoute: string;
};

export const MainMenu = ({
  mainmenu,
  currentRoute,
}: MainMenuProps): ReactElement => {
  return (
    <div className="my-7 flex-row">
      {mainmenu.map(entry => {
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

const MenuLink = ({
  entry,
  currentRoute,
}: {
  entry: MenuEntry;
  currentRoute: string;
}) => {
  const prefixedSlug =
    entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`;

  return (
    <Link key={entry.id} href={prefixedSlug}>
      <a
        className={`mx-2 text-xl nowrap ${
          prefixedSlug === currentRoute ? 'underline' : 'hoverUnderline'
        }`}
        aria-label={`Zu ${
          entry.slug === '/' ? 'Start' : entry.slug
        } navigieren`}
      >
        {entry.label}
      </a>
    </Link>
  );
};

const UserMenuLink = ({
  entry,
  currentRoute,
}: {
  entry: { id: string; slug: string; label: string };
  currentRoute: string;
}) => {
  const prefixedSlug =
    entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`;

  return (
    <Link key={entry.id} href={prefixedSlug}>
      <a
        className={`mx-2 text-xl nowrap pointer ${
          prefixedSlug === currentRoute ? 'underline' : 'hoverUnderline'
        }`}
        aria-label={`Zu ${entry.slug} navigieren`}
      >
        {entry.label}
      </a>
    </Link>
  );
};
