import Link from 'next/link';
import { MenuEntry } from '../../../utils/getMenus';

export const MenuLink = ({
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
