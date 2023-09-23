import s from './style.module.scss';
import { PageProps } from './[id]';
import { ReactElement } from 'react';
import { Section } from '../components/Section';
import { GetStaticProps } from 'next';
import { getPageProps } from '../utils/getPageProps';
import { Hero } from '../components/Hero';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === "Berlin";
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === "Hamburg";

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
  const pageProps = IS_BERLIN_PROJECT
    ? await getPageProps("start", preview)
    : IS_HAMBURG_PROJECT
    ? await getPageProps("start-hamburg", preview)
    : await getPageProps("start-hamburg", preview); //set to start-hamburg on expedition-grundeinkommen.de temporarily

  return {
    props: pageProps,
  };
};

export default Start;
