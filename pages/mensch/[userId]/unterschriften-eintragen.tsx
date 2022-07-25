import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileSignatures } from '../../../components/Profile/ProfileSignatures';
import fetchData from '../../blog/fetchData';
import { CampaignVisualisation } from '../../../components/CampaignVisualisations';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';
import { getCampaignVisualisations } from '../../../utils/getCampaignVisualisations';

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

export const getServerSideProps = async () => {
  const campaignVisualisations = await getCampaignVisualisations();
  return {
    props: {
      campaignVisualisations: campaignVisualisations || [],
    },
  };
};

export default UnterschriftenEintragen;
