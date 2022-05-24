import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileSignatures } from '../../../components/Profile/ProfileSignatures';
import fetchData from '../../blog/fetchData';
import { CampaignVisualisation } from '../../../components/CampaignVisualisations';
import { Layout } from '../../../layout';
import { Mainmenu } from '../../../utils/getMenus';

type UnterschriftenEintragenProps = {
  campaignVisualisations: CampaignVisualisation[];
  mainmenu: Mainmenu;
};

const UnterschriftenEintragen = ({
  campaignVisualisations,
  mainmenu,
}: UnterschriftenEintragenProps) => {
  const { userId, customUserData: userData } = useContext(AuthContext);

  return (
    <Layout mainmenu={mainmenu}>
      <ProfileSignatures
        campaignVisualisations={campaignVisualisations}
        userData={userData}
        userId={userId}
      />
    </Layout>
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
