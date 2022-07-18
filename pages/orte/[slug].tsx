import s from '../style.module.scss';
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
import Image from 'next/image';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

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
      <div className="flex mt-16 relative">
        <div className="w-half">
          <Image
            priority={true}
            src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/ca61a987-1b56-4f7a-903b-f2767b41fbe4`}
            alt="Logo der Expedition Grundeinkommen"
            height={728}
            width={1153}
            layout="responsive"
            className="z-10"
          />
        </div>
        <div className="w-half pr-16 pl-6 pt-16">
          <h2 className={`z-10 text-violet ${s.keyVisualClaim}`}>
            {municipality.name ? (
              <b>Hol das Grundeinkommen jetzt nach {municipality.name}</b>
            ) : (
              <b>Hol das Grundeinkommen jetzt in deinen Wohnort!</b>
            )}
          </h2>
        </div>
        <div className="bg-violet w-full h-10percent absolute bottom-0 z-0"></div>
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

  // We don't want to render municipality pages for berlin project
  if (IS_BERLIN_PROJECT) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  if (typeof params?.slug !== 'string') {
    return {
      props: {
        page: null,
      },
    };
  }

  const pageProps = await getPageProps('orte');

  const paramsSlug = params.slug.toLowerCase();

  const municipality: MunicipalityFromJson | undefined = municipalities.find(
    ({ slug }) => paramsSlug === slug
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
