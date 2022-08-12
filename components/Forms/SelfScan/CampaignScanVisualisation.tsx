import React from 'react';
import CampaignVisualisations, {
  CampaignVisualisation,
} from '../../CampaignVisualisations';
import s from './style.module.scss';

type CampainScanVisualisationProps = {
  campaignCode: string;
  campaignVisualisations: any;
  triggerUpdate?: number;
};

export const CampaignScanVisualisation = ({
  campaignCode,
  campaignVisualisations,
  triggerUpdate,
}: CampainScanVisualisationProps) => {
  const campaignVisualisationsMapped = campaignVisualisations.filter(
    (c: CampaignVisualisation) => c.campaignCode === campaignCode
  );

  return (
    <>
      {campaignVisualisationsMapped.length && (
        <div className={s.campaignVisualisations}>
          <CampaignVisualisations
            visualisations={campaignVisualisationsMapped}
            triggerUpdate={triggerUpdate}
          />
        </div>
      )}
    </>
  );
};
