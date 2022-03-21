import { ReactElement } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Mainmenu } from '../utils/getMenus';

type LayoutProps = {
  children: ReactElement;
  mainmenu: Mainmenu;
  currentRoute: string;
};

export const Layout = ({
  children,
  mainmenu,
  currentRoute,
}: LayoutProps): ReactElement => {
  return (
    <div className="flex-column container">
      <Head>
        <title>Expedition Grundeinkommen</title>
        <meta
          name="description"
          content="Modellversuch zum Grundeinkommen jetzt!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header mainmenu={mainmenu} currentRoute={currentRoute} />
      {children}
      <Footer />
      <div className="grow bg-red" />
    </div>
  );
};
