import { ReactElement } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Menuentry } from './Header/MainMenu';
import { Footer } from './Footer';

type LayoutProps = {
  children: ReactElement;
  mainmenu: Menuentry[];
};

export const Layout = ({ children, mainmenu }: LayoutProps): ReactElement => {
  return (
    <>
      <Head>
        <title>Expedition Grundeinkommen</title>
        <meta
          name='description'
          content='Modellversuch zum Grundeinkommen jetzt!'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header mainmenu={mainmenu} />
      {children}
      <Footer />
    </>
  );
};
