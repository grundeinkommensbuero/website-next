import { useRouter } from 'next/router';
import { createContext, ReactElement, useState } from 'react';

export const XbgeAppContext = createContext<{
  currentRoute: string;
  pageBuilderActive: boolean;
  togglePageBuilder: () => void;
}>({
  currentRoute: '/',
  pageBuilderActive: false,
  togglePageBuilder: () => {},
});

export const XbgeAppProvider = ({ children }: { children: ReactElement }) => {
  const [pageBuilderActive, setPageBuilderActive] = useState<boolean>(false);
  const togglePageBuilder = (): void => {
    setPageBuilderActive(!pageBuilderActive);
  };

  const router = useRouter();
  const currentRoute =
    typeof window !== undefined && router.isReady ? router.asPath : '/';

  return (
    <XbgeAppContext.Provider
      value={{ currentRoute, pageBuilderActive, togglePageBuilder }}
    >
      {children}
    </XbgeAppContext.Provider>
  );
};
