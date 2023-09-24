import s from './style.module.scss';
import { PageProps, index_slug } from './[id]';
import { ReactElement } from 'react';
import { Section } from '../components/Section';
import { GetStaticProps } from 'next';
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

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const pageProps = await getPageProps(index_slug, preview);

  return {
    props: pageProps,
  };
};

export default Start;
