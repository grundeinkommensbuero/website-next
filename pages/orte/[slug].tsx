import { GetServerSideProps } from 'next';

import Link from 'next/link';
import React, { ReactElement, useContext, useEffect } from 'react';

import { getPageProps, Page } from '../../utils/getPageProps';
import { Section } from '../../components/Section';

import municipalities from '../../data/municipalities.json';
import {
  Municipality,
  MunicipalityContext,
  MunicipalityFromJson,
} from '../../context/Municipality';
import {
  getMunicipalityData,
  getMunicipalityStats,
} from '../../hooks/Api/Municipalities';

export type PageProps = {
  page: Page | null;
  municipality: Municipality;
};

const MunicipalityPage = ({ page, municipality }: PageProps): ReactElement => {
  const { setMunicipality } = useContext(MunicipalityContext);

  useEffect(() => {
    setMunicipality(municipality);
  }, [municipality]);

  if (!page) {
    return (
      <div className="text-center">
        <h2 className="mt-16 mb-4 text-violet">
          Diese Seite gibt es leider nicht.
        </h2>
        <Link href="/">
          <a className="text-d-xl" aria-label="Zurück zur Startseite">
            Zurück zur Startseite
          </a>
        </Link>
      </div>
    );
  }
  return (
    <section>
      <div className="pageWidth">
        {page.title && <h2 className="text-violet my-8">{page.title}</h2>}
      </div>

      {page.sections.map((section: Section) => {
        // Check if section should be rendered for this municipality
        // depending on the includeAgs and excludeAgs arrays
        if (
          section.includeAgs.includes(municipality.ags) ||
          !section.excludeAgs.includes(municipality.ags)
        ) {
          return <Section key={section.id} section={section} />;
        }
      })}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${60 * 60}, stale-while-revalidate=${59}`
  );

  if (typeof params?.slug !== 'string') {
    return {
      props: {
        page: null,
      },
    };
  }

  const pageProps = await getPageProps('orte');

  const municipality: MunicipalityFromJson | undefined = municipalities.find(
    ({ slug }) => params.slug === slug
  );

  const ags = municipality?.ags;

  const [municipalityStats, municipalityData] = await Promise.all([
    getMunicipalityStats(ags),
    getMunicipalityData(ags),
  ]);

  return {
    props: {
      ...pageProps,
      municipality: {
        ags,
        ...municipalityData,
        ...municipalityStats,
      },
    },
  };
};

export default MunicipalityPage;
