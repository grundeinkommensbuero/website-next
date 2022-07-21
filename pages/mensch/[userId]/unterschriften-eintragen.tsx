import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileSignatures } from '../../../components/Profile/ProfileSignatures';
import fetchData from '../../blog/fetchData';
import { CampaignVisualisation } from '../../../components/CampaignVisualisations';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';

type UnterschriftenEintragenProps = {
  campaignVisualisations: CampaignVisualisation[];
};

const UnterschriftenEintragen = ({
  campaignVisualisations,
}: UnterschriftenEintragenProps) => {
  const { userId, customUserData: userData } = useContext(AuthContext);

  return (
    <ProfileWrapper id={userId}>
      <ProfileSignatures
        campaignVisualisations={campaignVisualisations}
        userData={userData}
        userId={userId}
      />
    </ProfileWrapper>
  );
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

export const getServerSideProps = async () => {
  const campaignVisualisations: Promise<CampaignVisualisation[]> =
    await fetchData(query, variables).then(data => {
      return data.data.CampaignVisualisations;
    });
  return {
    props: {
      campaignVisualisations: campaignVisualisations || [],
    },
  };
};

export default UnterschriftenEintragen;
