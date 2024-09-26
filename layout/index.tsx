import { ReactElement, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Menu } from '../utils/getMenus';
import { XbgeAppContext } from '../context/App/index';
import cN from 'classnames';
import { MunicipalityContext } from '../context/Municipality';

// This could also be fetched from directus, if frequently edited
import projects from './projects.json';
import { getRootAssetURL } from '../components/Util/getRootAssetURL';
import { useRouter } from 'next/router';
import { jumpToHash } from '../utils/jumpToHash';
import { LoadingAnimation } from '../components/LoadingAnimation';
import Script from 'next/script';
import { getAssetURL } from '../components/Util/getAssetURL';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

type Project = {
  siteTitle: string;
  siteDescription: string;
  ogimage: string;
  footerText: string;
};

const project: Project = IS_BERLIN_PROJECT
  ? projects.BERLIN_SITE
  : IS_HAMBURG_PROJECT
  ? projects.HAMBURG_SITE
  : projects.DEFAULT_SITE;

// Base URLs for the canonical links
const baseCanonicalUrl = IS_BERLIN_PROJECT
  ? 'https://expedition-grundeinkommen.de'
  : IS_HAMBURG_PROJECT
  ? 'https://hamburg-testet-grundeinkommen.de'
  : 'https://expedition-grundeinkommen.de';

type LayoutProps = {
  children: ReactElement;
  mainMenu: Menu;
  footerMenu: Menu;
  title?: string;
  description?: string;
  ogImage?: string;
};

declare global {
  interface Window {
    _paq: any;
  }
}

export const Layout = ({
  children,
  mainMenu,
  footerMenu,
  title,
  description,
  ogImage,
}: LayoutProps): ReactElement => {
  const router = useRouter();
  const { currentRoute } = useContext(XbgeAppContext);
  const { resetMunicipality } = useContext(MunicipalityContext);
  // Full canonical URL with path
  const canonicalUrl = `${baseCanonicalUrl}${router.asPath}`;

  const [pageIsLoading, setPageIsLoading] = useState(false);

  useEffect(() => {
    // on every route change we check, if we are still on a
    // municipality page, if not: reset the municipality context.
    if (!currentRoute.includes('orte')) {
      resetMunicipality();
    }

    const hash = window.location.hash;
    if (hash) {
      jumpToHash(hash);
    }
  }, [currentRoute]);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (window && window._paq) {
        window._paq.push(['setCustomUrl', url]);
        window._paq.push(['setDocumentTitle', document.title]);
        window._paq.push(['trackPageView']);
      }

      setPageIsLoading(true);
    };
    const handleComplete = (url: string) => setPageIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, []);

  if (currentRoute.includes('iframes')) {
    return <>{children}</>;
  }

  const metaDescription =
    description ||
    project?.siteDescription ||
    'Modellversuch zum Grundeinkommen jetzt!';
  const metaTitle =
    title || project?.siteTitle || 'Hamburg testet Grundeinkommen';
  const metaImage = ogImage
    ? getAssetURL(ogImage)
    : getRootAssetURL(
        project?.ogimage || '0263593e-697f-4c06-82ac-9aa7872c0384'
      );

  return (
    <>
      <div
        className={cN('flex-column', 'container', {
          fontBerlin: IS_BERLIN_PROJECT,
        })}
      >
        <Head>
          <>
            <title key="title">
              {`${title ? `${title} - ` : ''}${
                project?.siteTitle || 'Expedition Grundeinkommen'
              }`}
            </title>
            <meta
              key="description"
              name="description"
              content={metaDescription}
            />
            <link rel="canonical" href={canonicalUrl} />
            <meta key="og:title" property="og:title" content={metaTitle} />
            <meta
              key="og:description"
              property="og:description"
              content={metaDescription}
            />
            <meta key="og:image" property="og:image" content={metaImage} />

            <meta
              key="twitter:card"
              name="twitter:card"
              content="summary_large_image"
            />
            <meta
              key="twitter:site"
              name="twitter:site"
              content="@exbeditionbge"
            />
            <meta
              key="twitter:title"
              name="twitter:title"
              content={metaTitle}
            />
            <meta
              key="twitter:description"
              name="twitter:description"
              content={metaDescription}
            />
            <meta
              key="twitter:image"
              name="twitter:image"
              content={metaImage}
            />
          </>

          {IS_BERLIN_PROJECT ? (
            <link key="favicon" rel="icon" href="/favicon-berlin.ico" />
          ) : IS_HAMBURG_PROJECT ? (
            <link key="favicon" rel="icon" href="/favicon-hamburg.ico" />
          ) : (
            <link key="favicon" rel="icon" href="/favicon.ico" />
          )}
        </Head>
        <Header mainMenu={mainMenu} currentRoute={currentRoute} />
        {children}
        <Footer footerMenu={footerMenu} />
        <div
          className={cN(
            'grow',
            { 'bg-hh_rose': IS_HAMBURG_PROJECT },
            { 'bg-red': !IS_HAMBURG_PROJECT }
          )}
        />
      </div>
      {pageIsLoading && <LoadingAnimation fixed />}
      <Script id="matomo">
        {`  
        var _paq = window._paq = window._paq || [];
        _paq.push(['disableCookies']);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          const u="//expeditiongrundeinkommen.matomo.cloud/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', ${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}]);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
  `}
      </Script>
    </>
  );
};
