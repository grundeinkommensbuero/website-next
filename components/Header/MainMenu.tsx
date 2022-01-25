import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';

type MenuEntry = {
  id: number;
  slug: string;
  label: string;
  status: string;
  sort: number | null;
  date_updated: string | null;
  user_updated: string | null;
};

export const MainMenu = (): ReactElement => {
  const [data, setData] = useState<MenuEntry[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/mainmenu')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className='py-3'>
      {data &&
        data.map((entry) => {
          return (
            <Link key={entry.id} href={entry.slug}>
              <a className='mx-2 text-lg'>{entry.label}</a>
            </Link>
          );
        })}
    </div>
  );
};
