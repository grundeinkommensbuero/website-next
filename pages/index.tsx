import s from './style.module.scss';
import Image from 'next/image';
import { PageProps } from './[id]';
import { ReactElement } from 'react';
import { Section } from '../components/Section';
import { GetServerSideProps } from 'next';
import { getPageProps } from '../utils/getPageProps';
import { Hero } from '../components/Hero';

const Start = ({ page }: PageProps): ReactElement => {
  return (
    <div className={s.container}>
      <div className="flex mt-16 relative">
        <div className="w-half">
          <Image
            priority={true}
            src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/3e2ffd09-a09e-42ab-b234-19288361d727`}
            alt="Logo der Expedition Grundeinkommen"
            height={728}
            width={1153}
            layout="responsive"
            className="z-10"
          />
        </div>
        <div className="w-half pr-16 pl-6 pt-16">
          <h2 className={`z-10 text-violet ${s.keyVisualClaim}`}>
            <b>Hol das Grundeinkommen jetzt in deinen Wohnort!</b>
          </h2>
        </div>
        <div className="bg-violet w-full h-10percent absolute bottom-0 z-0"></div>
      </div>
      {page && (
        <>
          {page.hasHero && page.heroImage && (
            <Hero
              heroTitle={page.heroTitle}
              heroSubTitle={page.heroSubTitle}
              heroImage={page.heroImage}
            />
          )}
          <section>
            {page.sections.map((section: Section) => {
              return <Section key={section.id} section={section} />;
            })}
          </section>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${60 * 60}, stale-while-revalidate=${59}`
  );

  const pageProps = await getPageProps('start');

  return {
    props: pageProps,
  };
};

export default Start;
