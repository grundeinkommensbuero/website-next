import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/start.module.scss';
import { Header } from '../components/Header';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Expedition Grundeinkommen</title>
        <meta
          name='description'
          content='Modellversuch zum Grundeinkommen jetzt!'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <div className='m-8'>
        <h1>Willkommen an Board! :)</h1>
      </div>
    </div>
  );
};

export default Home;
