import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Layout } from '../layout';
import App from 'next/app';
import { getMenus, Mainmenu } from '../utils/getMenus';
import { NoSsr } from '../components/Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import { AuthProvider } from '../context/Authentication';
import CONFIG from '../backend-config';

const clientId = process.env.NEXT_PUBLIC_DEV_COGNITO_APP_CLIENT_ID;
if (clientId) {
  if (typeof window !== `undefined`) {
    import(/* webpackChunkName: "Amplify" */ '@aws-amplify/auth').then(
      ({ default: Amplify }) => {
        Amplify.configure({
          region: CONFIG.COGNITO.REGION,
          userPoolId: CONFIG.COGNITO.USER_POOL_ID,
          userPoolWebClientId: clientId,
        });
      }
    );
  }
} else {
  console.log('no userPoolWebClientId provided');
}

const queryClient = new QueryClient();

type XbgeAppProps = AppProps & { mainmenu: Mainmenu };

function XbgeApp({ Component, pageProps, mainmenu }: XbgeAppProps) {
  return (
    <AuthProvider>
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
    </AuthProvider>
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
