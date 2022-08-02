import Link from 'next/link';
import { useActions } from '../../../hooks/DirectusAction/useActions';
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
  const [actions] = useActions();

  const slug = entry.slug || '';
  const prefixedSlug = slug.substring(0, 1) === '/' ? slug : `/${slug}`;
  const action = entry.useAction && entry.action ? actions[entry.action] : null;

  return (
    <Link
      key={entry.id}
      href={entry.useAction && entry.action ? '' : prefixedSlug}
    >
      <a
        onClick={() => {
          if (extraCallback) extraCallback();
          if (action) action();
        }}
        className={`${isMobile ? 'my-2' : 'mx-2'} text-xl nowrap ${
          prefixedSlug === currentRoute
            ? `underline${underlineColor}`
            : `hoverUnderline${hoverUnderlineColor}`
        }`}
        aria-label={
          slug !== ''
            ? `Zu ${slug === '/' ? 'Start' : entry.slug} navigieren`
            : ''
        }
      >
        {entry.label}
      </a>
    </Link>
  );
};
