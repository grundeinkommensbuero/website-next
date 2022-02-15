import Link from 'next/link';
import { ReactElement } from 'react';
import { Dropdown, Mainmenu, MenuEntry } from '../../../utils/getMenus';
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
    <div className='my-7 flex-row'>
      {mainmenu.map((entry) => {
        if ((entry as Dropdown).entries)
          return (
            <div className={s.dropdown}>
              <span className='mx-2 text-xl nowrap'>{entry.label}</span>
              <div className={s.dropdownContent}>
                <>
                  {(entry as Dropdown).entries.map((entry) => {
                    return (
                      <div className='my-4' key={entry.slug}>
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
  return (
    <Link
      key={entry.id}
      href={
        // Apperently this prop is getting prefixed in the client, but
        // not on the server. Until fixed this workaround helps:
        entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`
      }>
      <a
        className={`mx-2 text-xl nowrap ${
          entry.slug === currentRoute ? 'underline' : 'hoverUnderline'
        }`}
        aria-label={`Zu ${
          entry.slug === '/' ? 'Start' : entry.slug
        } navigieren`}>
        {entry.label}
      </a>
    </Link>
  );
};
