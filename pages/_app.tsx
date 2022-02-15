import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../components/Layout';
import App from 'next/app';
import { getMenus, Mainmenu } from '../utils/getMenus';

const queryClient = new QueryClient();

type XbgeAppProps = AppProps & { mainmenu: Mainmenu };

function XbgeApp({ Component, pageProps, mainmenu }: XbgeAppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout mainmenu={mainmenu}>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}

XbgeApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const menus = await getMenus();

  // Pass current route as string to all pages
  const route = appContext.router.route;

  return {
    ...appProps,
    mainmenu: menus.mainmenu,
    pageProps: {
      route,
    },
  };
};

export default XbgeApp;
