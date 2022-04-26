import React from 'react';
import CampaignVisualisations from '../../CampaignVisualisations';
import s from './style.module.scss';
import { Directus } from '@directus/sdk';
import { CampaignVisualisation } from '../../../pages/mensch/[userId]/unterschriften-eintragen';

type CampainScanVisualisationProps = {
  campaignCode: string;
  campaignVisualisations: any;
};

export const CampainScanVisualisation = ({
  campaignCode,
  campaignVisualisations,
}: CampainScanVisualisationProps) => {
  const campaignVisualisationsMapped = campaignVisualisations.filter(
    (c: CampaignVisualisation) => c.campainCode === campaignCode
  );

  return (
    <>
      {campaignVisualisationsMapped.length && (
        <div className={s.campaignVisualisations}>
          <CampaignVisualisations
            visualisations={campaignVisualisationsMapped}
          />
        </div>
      )}
    </>
  );

  return <h2>Hello</h2>;
};
