import React from 'react';
// import CampaignVisualisations from '../../CampaignVisualisations';
import s from './style.module.scss';
import { Directus } from '@directus/sdk';

type CampainScanVisualisationProps = {
  campaignCode: string;
  // campaignVisualisations: any;
};

export const CampainScanVisualisation = ({
  campaignCode, // campaignVisualisations,
}: CampainScanVisualisationProps) => {
  // const {
  //   allContentfulKampagnenvisualisierung: { edges: campaignVisualisations },
  // } = useStaticQuery(graphql`
  //   query campaignVisualisations {
  //     allContentfulKampagnenvisualisierung {
  //       edges {
  //         node {
  //           hint {
  //             hint
  //           }
  //           goal
  //           goalInbetween
  //           goalUnbuffered
  //           minimum
  //           startDate
  //           title
  //           addToSignatureCount
  //           campainCode
  //         }
  //       }
  //     }
  //   }
  // `);

  // const campaignVisualisationsMapped = campaignVisualisations.filter(
  //   ({ campainCode: campaignCodeVisualisation }) => {
  //     return campaignCodeVisualisation === campaignCode;
  //   }
  // );

  // return (
  //   <>
  //     {campaignVisualisationsMapped.length && (
  //       <div className={s.campaignVisualisations}>
  //         {/* <CampaignVisualisations
  //           visualisations={campaignVisualisationsMapped}
  //         /> */}
  //       </div>
  //     )}
  //   </>
  // );

  return <h2>Hello</h2>;
};
