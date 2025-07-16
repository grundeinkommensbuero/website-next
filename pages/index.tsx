import { Widget } from '@typeform/embed-react';
import cN from 'classnames';
import { GetStaticProps } from 'next';
import { ReactElement, useEffect, useState } from 'react';
import { CTALink } from '../components/Forms/CTAButton';
import { Hero } from '../components/Hero';
import { Modal } from '../components/Modal';
import { Section } from '../components/Section';
import { getPageProps } from '../utils/getPageProps';
import PageNotFound from './404';
import { PageProps, index_slug } from './[id]';
import s from './style.module.scss';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

const Start = ({ page }: PageProps): ReactElement => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (page?.hasPopup) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');

      if (!hasSeenPopup) {
        setShowModal(true);
        sessionStorage.setItem('hasSeenPopup', 'true');
      }
    }
  }, [page?.hasPopup]);

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <section className={cN({ hamburg: IS_HAMBURG_PROJECT })}>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        colorScheme={page.popupColorScheme}
        noFixedHeight
      >
        <div className={s.popupContentContainer}>
          <div>{page.popupContent}</div>
          {page.popupButtonLink && page.popupButtonText && (
            <CTALink to={page.popupButtonLink}>{page.popupButtonText}</CTALink>
          )}
        </div>
      </Modal>
      {/* see https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml and https://blog.logrocket.com/using-dangerouslysetinnerhtml-react-application/ */}
      {page.heroHTML && (
        <div
          className={s.heroHTMLContainer}
          dangerouslySetInnerHTML={{ __html: page.heroHTML }}
        />
      )}
      {page.typeformId && (
        <div>
          <Widget
            id={page.typeformId}
            style={{ width: '100%', height: '650px' }}
            className="my-form"
          />
          <p className={s.manualLoadingHint}>
            Das Formular lädt nicht? Dann klicke{' '}
            <a
              href={`https://expeditionbge.typeform.com/to/${page.typeformId}?utm_campaign=formular_error`}
            >
              hier
            </a>
            .
          </p>
        </div>
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
