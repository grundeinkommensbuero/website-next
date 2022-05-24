import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { Layout } from '../layout';
import App from 'next/app';
import { getMenus, Mainmenu } from '../utils/getMenus';
import { NoSsr } from '../components/Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import { ProviderWrapper } from '../components/Util/ProviderWrapper';
import { Toaster } from 'react-hot-toast';
import { TrackJS } from 'trackjs';
import { Amplify } from 'aws-amplify';
import CONFIG from '../backend-config';

type XbgeAppProps = AppProps & { mainmenu: Mainmenu };

TrackJS.install({
  token: process.env.NEXT_PUBLIC_TRACKJS_TOKEN || '',
  application: 'expedition-grundeinkommen',
});

const clientId = process.env.NEXT_PUBLIC_DEV_COGNITO_APP_CLIENT_ID;

if (clientId) {
  Amplify.configure({
    region: CONFIG.COGNITO.REGION,
    userPoolId: CONFIG.COGNITO.USER_POOL_ID,
    userPoolWebClientId: clientId,
    ssr: true,
  });
} else {
  console.log('no userPoolWebClientId provided');
}

function XbgeApp({ Component, pageProps, mainmenu }: XbgeAppProps) {
  return (
    <ProviderWrapper>
      <Toaster toastOptions={{ position: 'top-right' }} />
      <Component {...pageProps} mainmenu={mainmenu} />
      <NoSsr>
        <ReactTooltip backgroundColor={'black'} />
      </NoSsr>
    </ProviderWrapper>
  );
}

XbgeApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const menus = await getMenus();

  return {
    ...appProps,
    mainmenu: menus.mainmenu,
  };
};

export default XbgeApp;
