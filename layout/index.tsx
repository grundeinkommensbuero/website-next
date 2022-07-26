import { ReactElement, useContext } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Menu } from '../utils/getMenus';
import { XbgeAppContext } from '../context/App/index';
import cN from 'classnames';

// This could also be fetched from directus, if frequently edited
import projects from './projects.json';
import { getRootAssetURL } from '../components/Util/getRootAssetURL';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type Project = {
  siteTitle: string;
  siteDescription: string;
  ogimage: string;
  footerText: string;
};

const project: Project = IS_BERLIN_PROJECT
  ? projects.BERLIN_SITE
  : projects.DEFAULT_SITE;

type LayoutProps = {
  children: ReactElement;
  mainMenu: Menu;
  footerMenu: Menu;
};

export const Layout = ({
  children,
  mainMenu,
  footerMenu,
}: LayoutProps): ReactElement => {
  const { currentRoute } = useContext(XbgeAppContext);

  return (
    <div
      className={cN('flex-column', 'container', {
        fontBerlin: IS_BERLIN_PROJECT,
      })}
    >
      <Head>
        <title key="title">
          {project?.siteTitle || 'Expedition Grundeinkommen'}
        </title>
        <meta
          key="description"
          name="description"
          content={
            project?.siteDescription ||
            'Modellversuch zum Grundeinkommen jetzt!'
          }
        />
        <meta
          key="og:title"
          property="og:title"
          content={project?.siteTitle || 'Expedition Grundeinkommen'}
        />
        <meta
          key="og:description"
          property="og:description"
          content={
            project?.siteDescription ||
            'Modellversuch zum Grundeinkommen jetzt!'
          }
        />
        <meta
          key="og:image"
          property="og:image"
          content={getRootAssetURL(
            project?.ogimage || '57331286-2406-4f11-a523-dda6a2166c2e'
          )}
        />
        {IS_BERLIN_PROJECT ? (
          <link key="favicon" rel="icon" href="/favicon-berlin.ico" />
        ) : (
          <link key="favicon" rel="icon" href="/favicon.ico" />
        )}
      </Head>

      <Header mainMenu={mainMenu} currentRoute={currentRoute} />
      {children}
      <Footer footerMenu={footerMenu} />
      <div className="grow bg-red" />
    </div>
  );
};
