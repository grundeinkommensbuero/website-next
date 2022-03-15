import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../Layout';
import App from 'next/app';
import { getMenus, Mainmenu } from '../directus/sdk/getMenus';
import { NoSsr } from '../components/Util/NoSsr';
import ReactTooltip from 'react-tooltip';

const queryClient = new QueryClient();

type XbgeAppProps = AppProps & { mainmenu: Mainmenu };

function XbgeApp({ Component, pageProps, mainmenu }: XbgeAppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout mainmenu={mainmenu} currentRoute={pageProps.route}>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
      <NoSsr>
        <ReactTooltip backgroundColor={'black'} />
      </NoSsr>
    </>
  );
}

XbgeApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const menus = await getMenus();

  // Pass current route as string to all pages
  const route = appContext.router.query.id ? appContext.router.query.id : '/';

  return {
    ...appProps,
    mainmenu: menus.mainmenu,
    pageProps: {
      route,
    },
  };
};

export default XbgeApp;
