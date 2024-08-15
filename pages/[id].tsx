import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import React, { ReactElement, useState, useEffect } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { getPageProps, Page } from '../utils/getPageProps';
import { Section } from '../components/Section';
import { Hero } from '../components/Hero';
import { Directus } from '@directus/sdk';
import { Widget } from '@typeform/embed-react';
import PageNotFound from './404';
import querystring from 'query-string';

/* FIXME: This is not how we should do it */
function IframeBriefeintragung() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Code needs to run client side to get access to 'window'
  if (isClient) {
    const queryString = querystring.parse(window.location.search);
    var IframeURL =
      'https://briefeintragung-grundeinkommen.netlify.app/register/' +
      '?' +
      querystring.stringify(queryString);
    var IframeHTML = `<iframe src=''
  scrolling='no' width='100%' id='briefeintragung-iframe'
  sandbox='allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-top-navigation allow-top-navigation-by-user-activation'>
</iframe>
<script>
window.addEventListener('message', (message) => {
  console.debug('got message', message)
  if (
    typeof message.data !== 'object' ||
    !message.data ||
    !('message' in message.data)) {
    console.debug('ignoring unknown message')
    return
  }
  if(message.data.message === 'sendLetterEntryHeightToParent'
  ) {
    const heightPx = \`\${message.data.height}px\`
    document.getElementById('briefeintragung-iframe')?.setAttribute('height', heightPx)
  }
  if(message.data.message === 'sendLetterEntryRegistrationSuccessToParent'
  ) {
    window.location.href = '/briefeintragung-erfolg'
  }
})
</script>
<style>
.iframe-container {
  top: -85px;
  position: relative;
}
#briefeintragung-iframe {
  height: 1200px;
  border: none;
}
@media screen and (min-width: 500px) {
  #briefeintragung-iframe{
    height: 1050px;
  }
}
</style>
`;
    var iframediv = document.getElementsByClassName('iframe-container')[0];
    if (iframediv !== null) {
      iframediv.innerHTML = IframeHTML;
    }
    var iframe = document.getElementById('briefeintragung-iframe');
    if (iframe !== null) {
      iframe.setAttribute('src', IframeURL);
    }
  }
  // We have to return a string because we invoke the function via
  // dangerouslySetInnerHTML
  return '';
}

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

export const index_slug = IS_BERLIN_PROJECT
  ? 'start'
  : IS_HAMBURG_PROJECT
  ? 'start-hamburg'
  : 'start-hamburg'; //set to start-hamburg on expedition-grundeinkommen.de also temporarily

export type PageProps = {
  page: Page | null;
};

const PageWithSections = ({ page }: PageProps): ReactElement => {
  if (!page) {
    return <PageNotFound />;
  }
  return (
    <section>
      {/* see https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml and https://blog.logrocket.com/using-dangerouslysetinnerhtml-react-application/ */}
      {page.heroHTML && (
        <div
          className={s.heroHTMLContainer}
          dangerouslySetInnerHTML={{ __html: page.heroHTML }}
        />
      )}
      {page.typeformId && (
        <Widget
          id={page.typeformId}
          style={{ width: '100%', height: '650px' }}
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
      {page.slug == 'briefeintragung' && (
        <div
          className="iframe-container"
          /*
           * FIXME: There must be a nicer way to do this:
           * IframeBriefeintragung() does not actually return HTML,
           * but modifies the divs HTML on the client, i. e. we just
           * call it for the side effects
           */
          dangerouslySetInnerHTML={{ __html: IframeBriefeintragung() }}
        />
      )}
    </section>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    const pages = (
      await directus.items('pages').readByQuery({
        fields: ['slug'],
        filter: {
          status: {
            _eq: 'published',
          },
          slug: {
            _neq: index_slug,
          },
        },
      })
    ).data as Page[] | null | undefined;

    return {
      paths: pages?.map(({ slug }) => ({ params: { id: slug } })) || [],
      fallback: false,
    };
  } catch (err) {
    console.log(err);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  if (!(typeof params?.id === 'string')) {
    return {
      props: {
        page: null,
      },
    };
  }

  const pageProps = await getPageProps(params.id, preview);

  return {
    props: pageProps,
  };
};

export default PageWithSections;
