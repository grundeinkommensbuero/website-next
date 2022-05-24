import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileNotifications } from '../../../components/Profile/ProfileNotifications';
import { Layout } from '../../../layout';
import { Mainmenu } from '../../../utils/getMenus';

const KonataktEinstellungen = ({ mainmenu }: { mainmenu: Mainmenu }) => {
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
      <ProfileNotifications
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </Layout>
  );
};

export default KonataktEinstellungen;
