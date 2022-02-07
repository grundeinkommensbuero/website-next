import type { NextPage } from 'next';
import styles from '../styles/start.module.scss';
import Image from 'next/image';

const Start: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className='flex mt-5% relative'>
        <div className='w-3/6'>
          <Image
            priority={true}
            src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/3e2ffd09-a09e-42ab-b234-19288361d727`}
            alt='Logo der Expedition Grundeinkommen'
            height={728}
            width={1153}
            layout='responsive'
            className='z-10'
          />
        </div>
        <div className='w-3/6 pr-10% pl-5% pt-5%'>
          <h2 className='z-10'>
            <b>Hol das Grundeinkommen jetzt in deinen Wohnort!</b>
          </h2>
        </div>
        <div className='bg-violet w-full h-10% absolute bottom-0 z-0'></div>
      </div>
      <section className='bg-violet'>
        <h2 className='text-white'>Section 1 :)</h2>
      </section>
    </div>
  );
};

export default Start;
