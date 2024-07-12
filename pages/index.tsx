import s from './style.module.scss';
import { PageProps, index_slug } from './[id]';
import { ReactElement } from 'react';
import { Section } from '../components/Section';
import { GetStaticProps } from 'next';
import { getPageProps } from '../utils/getPageProps';
import { Widget } from '@typeform/embed-react';
import { Hero } from '../components/Hero';

const Start = ({ page }: PageProps): ReactElement => {
  return (
    <section>
      {/* see 
      https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml 
      and 
      https://blog.logrocket.com/using-dangerouslysetinnerhtml-react-application/
      */}
      {(page.heroHTML) && (
        <div
          className={s.heroHTMLContainer}
          dangerouslySetInnerHTML={{ __html: page.heroHTML! }}
        />
      )}
      {page.typeformId && (
        <Widget
          id={page.typeformId!}
          style={{ width: '100%', height: '500px' }}
          className="my-form"
        />
      )}
      {page.hasHero && page.heroImage && (
        <Hero
          heroTitle={page.heroTitle}
          heroSubTitle={page.heroSubTitle}
          heroImage={page.heroImage}
        />
      )}
      <div className="pageWidth">
        {page.title && <h2 className="my-8">{page.title}</h2>}
      </div>
      {page.sections.map((section: Section, index: number) => {
        return (
          <Section
            key={section.id}
            section={section}
            isFirstSection={index === 0}
          />
        );
      })}
    </section>
  );
};

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const pageProps = await getPageProps(index_slug, preview);

  return {
    props: pageProps,
  };
};

export default Start;
