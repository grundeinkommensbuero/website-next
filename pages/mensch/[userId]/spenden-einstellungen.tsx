import { useContext } from 'react';
import { ProfileDonationSettings } from '../../../components/Profile/ProfileDonationSettings';
import AuthContext from '../../../context/Authentication';
import { Layout } from '../../../layout';
import { Mainmenu } from '../../../utils/getMenus';

const SpendenEinstellungen = ({ mainmenu }: { mainmenu: Mainmenu }) => {
  const {
    userId,
    customUserData: userData,
    updateCustomUserData,
  } = useContext(AuthContext);

  const triggerUpdateCustomUserData = () => {
    updateCustomUserData();
  };

  return (
    <Layout mainmenu={mainmenu}>
      <ProfileDonationSettings
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </Layout>
  );
};

export default SpendenEinstellungen;
