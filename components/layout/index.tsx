import { ReactElement } from 'react';
import Head from 'next/head';
import { Header } from '../header';
import { Menuentry } from '../header/MainMenu';

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
    </>
  );
};
