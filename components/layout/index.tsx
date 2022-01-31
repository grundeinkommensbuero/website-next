import { ReactElement } from 'react';
import Head from 'next/head';
import { Header } from '../header';

type LayoutProps = {
  children: ReactElement;
};

export const Layout = ({ children }: LayoutProps): ReactElement => {
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
      <Header />
      {children}
    </>
  );
};
