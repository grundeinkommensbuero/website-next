import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../components/Layout';
import fetchData from '../directus/graphql/fetchData';
import App from 'next/app';
import { getMenus, MenuElement } from '../utils/getMenus';

const queryClient = new QueryClient();

type XbgeAppProps = AppProps & { mainmenu: MenuElement[] };

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
  const mainmenu = await fetchData(query, variables);

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

const query = `query Mainmenu {
  mainmenu {
    id
    label
    slug
  }
}
`;

const variables = {
  variables: {},
};

export default XbgeApp;
