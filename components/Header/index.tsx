import { ReactElement, useEffect, useState } from 'react';

type MenuEntry = {
  slug: string;
  label: string;
};

export const Header = (): ReactElement => {
  const [data, setData] = useState<MenuEntry[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/mainmenu')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className='bg-slate-700 px-8 py-2 h-14'>
      {data &&
        data.map((entry) => {
          return (
            <button
              className='py-2 px-6 mr-2 text-white bg-slate-600 hover:bg-slate-800 rounded'
              key={entry.slug}>
              {entry.label}
            </button>
          );
        })}
    </div>
  );
};
