import { useEffect, useState } from 'react';
import { getCampaignVisualisations } from '../../utils/getCampaignVisualisations';
import CampaignVisualisations, {
  CampaignVisualisation,
} from '../CampaignVisualisations';

type CampaignVisualisationDynamicProps = {
  campaignCode?: string;
};

const CampaignVisualisationDynamic = ({
  campaignCode = 'berlin-2',
}: CampaignVisualisationDynamicProps) => {
  const [campaignVisualisations, setCampaignVisualisations] =
    useState<CampaignVisualisation[]>();

  useEffect(() => {
    getCampaignVisualisations().then(visualisations =>
      setCampaignVisualisations(
        visualisations.filter(
          visualisation => visualisation.campaignCode === campaignCode
        )
      )
    );
  }, []);

  return <CampaignVisualisations visualisations={campaignVisualisations} />;
};

export default CampaignVisualisationDynamic;
