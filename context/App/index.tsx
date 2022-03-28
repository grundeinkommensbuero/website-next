import { useRouter } from 'next/router';
import { createContext, ReactElement } from 'react';

export const XbgeAppContext = createContext<{
  currentRoute: string;
}>({
  currentRoute: '/',
});

export const XbgeAppProvider = ({ children }: { children: ReactElement }) => {
  const router = useRouter();
  const currentRoute =
    typeof window !== undefined && router.isReady ? router.asPath : '/';

  return (
    <XbgeAppContext.Provider value={{ currentRoute }}>
      {children}
    </XbgeAppContext.Provider>
  );
};
