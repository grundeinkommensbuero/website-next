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
