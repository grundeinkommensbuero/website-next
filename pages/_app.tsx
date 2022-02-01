import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../components/layout';
import fetchData from '../graphql/fetchData';
import App from 'next/app';

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
  return { mainmenu: mainmenu.data.mainmenu, ...appProps };
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
