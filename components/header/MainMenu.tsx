import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { Menuentry } from '../../pages/api/content/mainmenu';

export const MainMenu = (): ReactElement => {
  const [data, setData] = useState<Menuentry[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/content/mainmenu')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className='py-4'>
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
