import Link from 'next/link';
import { MenuEntry } from '../../../utils/getMenus';

type UnderlineColor = 'BLACK' | 'WHITE' | 'RED';

type MenuLinkProps = {
  entry: MenuEntry;
  currentRoute?: string;
  underlineColor?: UnderlineColor;
  hoverUnderlineColor?: UnderlineColor;
};

export const MenuLink = ({
  entry,
  currentRoute,
  underlineColor = 'BLACK',
  hoverUnderlineColor = 'BLACK',
}: MenuLinkProps) => {
  const prefixedSlug =
    entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`;

  return (
    <Link key={entry.id} href={prefixedSlug}>
      <a
        className={`mx-2 text-xl nowrap ${
          prefixedSlug === currentRoute
            ? `underline${underlineColor}`
            : `hoverUnderline${hoverUnderlineColor}`
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
