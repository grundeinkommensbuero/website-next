// Map campaign code to ags by extracting state out of campaign code

import { stateToAgs } from './stateToAgs';

// ad mapping that state to the ags
export function mapCampaignCodeToAgs(campaignCode: string) {
  return stateToAgs[campaignCode.split('-')[0]];
}

// Takes campaign code in the format of e.g. schleswig-holstein-1 or berlin-1
// and transforms it to Schleswig-Holstein or Berlin
export function mapCampaignCodeToState(campaignCode: string) {
  const stringSplit = campaignCode.split('-');
  if (stringSplit.length > 2) {
    return `${capitalize(stringSplit[0])}-${capitalize(stringSplit[1])}`;
  } else {
    return `${capitalize(stringSplit[0])}`;
  }
}

function capitalize(string: string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
