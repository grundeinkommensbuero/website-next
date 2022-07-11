import { ReactElement, useContext } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Menu } from '../utils/getMenus';
import { XbgeAppContext } from '../context/App/index';
import cN from 'classnames';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

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
        <title>Expedition Grundeinkommen</title>
        <meta
          name="description"
          content="Modellversuch zum Grundeinkommen jetzt!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header mainMenu={mainMenu} currentRoute={currentRoute} />
      {children}
      <Footer footerMenu={footerMenu} />
      <div className="grow bg-red" />
    </div>
  );
};
