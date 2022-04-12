import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { Layout } from '../layout';
import App from 'next/app';
import { getMenus, Mainmenu } from '../utils/getMenus';
import { NoSsr } from '../components/Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import { ProviderWrapper } from '../components/Util/ProviderWrapper';
import { Toaster } from 'react-hot-toast';

type XbgeAppProps = AppProps & { mainmenu: Mainmenu };

function XbgeApp({ Component, pageProps, mainmenu }: XbgeAppProps) {
  return (
    <ProviderWrapper>
      <Toaster toastOptions={{ position: 'top-right' }} />
      <Layout mainmenu={mainmenu}>
        <Component {...pageProps} />
      </Layout>
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
