import { ReactElement, useContext } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Mainmenu } from '../utils/getMenus';
import { XbgeAppContext } from '../context/App/index';

type LayoutProps = {
  children: ReactElement;
  mainmenu: Mainmenu;
};

export const Layout = ({ children, mainmenu }: LayoutProps): ReactElement => {
  const { currentRoute } = useContext(XbgeAppContext);

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
