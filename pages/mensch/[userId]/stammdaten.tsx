import { useContext } from 'react';
import { PersonalSettings } from '../../../components/Profile/PersonalSettings';
import AuthContext from '../../../context/Authentication';
import { Layout } from '../../../layout';
import { Mainmenu } from '../../../utils/getMenus';

const Stammdaten = ({ mainmenu }: { mainmenu: Mainmenu }) => {
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
      <PersonalSettings
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </Layout>
  );
};

export default Stammdaten;
