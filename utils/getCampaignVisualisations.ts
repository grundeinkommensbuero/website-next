import fetchData from '../pages/blog/fetchData';
import { CampaignVisualisation } from './../components/CampaignVisualisations/index';

const query = `query CampaignVisualisations {
  CampaignVisualisations {
    id
    title
    startDate
    campaignCode
    hint
    goal
    goalInbetweenMultiple
    goalUnbuffered
    maximum
    minimum
    addToSignatureCount
    startnextId
    ctaLink
    project
  }
}
`;

const variables = {
  variables: {},
};

export const getCampaignVisualisations = async () => {
  const campaignVisualisations: CampaignVisualisation[] = await fetchData(
    query,
    variables
  ).then(data => {
    return data.data.CampaignVisualisations;
  });

  return campaignVisualisations;
};
