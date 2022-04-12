import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileSignatures } from '../../../components/Profile/ProfileSignatures';
import fetchData from '../../blog/fetchData';

type UnterschriftenEintragenProps = {
  campaignVisualisations: CampaignVisualisation[];
};

const UnterschriftenEintragen = ({
  campaignVisualisations,
}: UnterschriftenEintragenProps) => {
  const { userId, customUserData: userData } = useContext(AuthContext);
  console.log(campaignVisualisations);

  return <ProfileSignatures userData={userData} userId={userId} />;
};

export type CampaignVisualisation = {
  id: string;
  title: string;
  startDate: string;
  campainCode: string;
  hint: string;
  goal: number;
  goalInbetween: number | null;
  goalUnbuffered: number | null;
  minimum: number | null;
  addToSignatureCount: number | null;
};

const query = `query CampaignVisualisations {
  CampaignVisualisations {
    id
    title
    startDate
    campainCode
    hint
    goal
    goalInbetween
    goalUnbuffered
    minimum
    addToSignatureCount
  }
}
`;

const variables = {
  variables: {},
};

export const getServerSideProps = async () => {
  const campaignVisualisations: Promise<CampaignVisualisation[]> =
    await fetchData(query, variables).then(data => {
      return data.data.campaignVisualisations;
    });
  console.log(campaignVisualisations);

  return {
    props: {
      campaignVisualisations: campaignVisualisations || [],
    },
  };
};

export default UnterschriftenEintragen;
