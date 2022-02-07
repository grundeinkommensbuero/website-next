import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../components/layout';
import fetchData from '../directus/graphql/fetchData';
import App from 'next/app';
import { getPageProps } from '../utils/getPageProps';

const queryClient = new QueryClient();

type XbgeAppProps = AppProps & { mainmenu: Menuentry[] };

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

  const route =
    appContext.router.route === '/' ? 'start' : appContext.router.route;

  // TODO: Refctor!
  // const directusPage =
  //   appContext.router.route === '/' ? 'start' : appContext.router.route;
  // let pageProps;
  // if (directusPage !== '/[id]') {
  //   pageProps = await getPageProps(directusPage);
  // } else {
  //   pageProps = {
  //     page: null,
  //     sections: [],
  //   };
  // }
  return {
    ...appProps,
    mainmenu: mainmenu.data.mainmenu,
    pageProps: {
      route,
    },
  };
};

export type Menuentry = {
  id: string;
  label: string;
  slug: string;
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
