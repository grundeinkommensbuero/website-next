import '../styles/globals.scss';
import type { AppContext, AppProps } from 'next/app';
import { Layout } from '../layout';
import App from 'next/app';
import { getMenus, Menu } from '../utils/getMenus';
import { NoSsr } from '../components/Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import { ProviderWrapper } from '../components/Util/ProviderWrapper';
import { Toaster } from 'react-hot-toast';
import { TrackJS } from 'trackjs';
import 'react-phone-number-input/style.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

type XbgeAppProps = AppProps & { mainMenu: Menu; footerMenu: Menu };

TrackJS.install({
  token: process.env.NEXT_PUBLIC_TRACKJS_TOKEN || '',
  application: 'expedition-grundeinkommen',
});

function XbgeApp({ Component, pageProps, mainMenu, footerMenu }: XbgeAppProps) {
  return (
    <ProviderWrapper>
      <Toaster toastOptions={{ position: 'top-right' }} />
      <Layout
        mainMenu={mainMenu}
        footerMenu={footerMenu}
        title={pageProps.page?.metaTitle}
        description={pageProps.page?.metaDescription}
        ogImage={pageProps.page?.ogImage}
      >
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
    mainMenu: menus.mainMenu,
    footerMenu: menus.footerMenu,
  };
};

export default XbgeApp;
