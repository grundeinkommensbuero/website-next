import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/start.module.scss';
import { Header } from '../components/Header';
import Image from 'next/image';

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
      <div className='flex my-16'>
        <div className='w-3/6'>
          <Image
            src={`https://xbge-directus.frac.tools/assets/3e2ffd09-a09e-42ab-b234-19288361d727`}
            alt='Logo der Expedition Grundeinkommen'
            height={728}
            width={1153}
            layout='responsive'
          />
        </div>
        <div className='w-3/6'>
          <h2>Hol das Grundeinkommen in deinen Wohnort!</h2>
        </div>
      </div>
      <section>
        <h2>Section 1 :)</h2>
      </section>
    </div>
  );
};

export default Home;
