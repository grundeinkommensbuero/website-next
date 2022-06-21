import Link from 'next/link';
import { MenuEntry } from '../../../utils/getMenus';

type UnderlineColor = 'BLACK' | 'WHITE' | 'RED';

type MenuLinkProps = {
  entry: MenuEntry;
  currentRoute?: string;
  underlineColor?: UnderlineColor;
  hoverUnderlineColor?: UnderlineColor;
  isMobile?: boolean;
  extraCallback?: () => void;
};

export const MenuLink = ({
  entry,
  currentRoute,
  underlineColor = 'BLACK',
  hoverUnderlineColor = 'BLACK',
  isMobile = false,
  extraCallback,
}: MenuLinkProps) => {
  const prefixedSlug =
    entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`;

  return (
    <Link key={entry.id} href={prefixedSlug}>
      <a
        onClick={() => {
          if (extraCallback) extraCallback();
        }}
        className={`${isMobile ? 'my-2' : 'mx-2'} text-xl nowrap ${
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
