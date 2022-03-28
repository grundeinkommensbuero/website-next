import Link from 'next/link';
import { ReactElement } from 'react';

export type CustomEntry = {
  id: string;
  slug: string;
  label: string;
};

type CustomMenuLinkProps = {
  entry: CustomEntry;
  currentRoute: string;
};

export const CustomMenuLink = ({
  entry,
  currentRoute,
}: CustomMenuLinkProps): ReactElement => {
  const prefixedSlug =
    entry.slug.substring(0, 1) === '/' ? entry.slug : `/${entry.slug}`;

  return (
    <Link key={entry.id} href={prefixedSlug}>
      <a
        className={`mx-2 text-xl nowrap cursor-pointer ${
          prefixedSlug === currentRoute ? 'underline' : 'hoverUnderline'
        }`}
        aria-label={`Zu ${entry.slug} navigieren`}
      >
        {entry.label}
      </a>
    </Link>
  );
};
