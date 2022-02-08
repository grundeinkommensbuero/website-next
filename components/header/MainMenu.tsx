import Link from 'next/link';
import { ReactElement } from 'react';

export type Menuentry = {
  id: string;
  label: string;
  slug: string;
};

type MainMenuProps = {
  mainmenu: Menuentry[];
};

export const MainMenu = ({ mainmenu }: MainMenuProps): ReactElement => {
  return (
    <div className='py-4'>
      {mainmenu.map((entry) => {
        return (
          <Link
            key={entry.id}
            href={
              // Apperently this prop is getting prefixed in the client, but
              // not on the server. Until fixed this workaround helps:
              entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`
            }>
            <a
              className='mx-2 text-d-lg'
              aria-label={`Zu ${
                entry.slug === '/' ? 'Start' : entry.slug
              } navigieren`}>
              {entry.label}
            </a>
          </Link>
        );
      })}
    </div>
  );
};
