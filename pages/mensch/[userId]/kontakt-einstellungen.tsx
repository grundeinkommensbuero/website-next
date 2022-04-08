import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileNotifications } from '../../../components/Profile/ProfileNotifications';

const KonataktEinstellungen = () => {
  const {
    userId,
    customUserData: userData,
    updateCustomUserData,
  } = useContext(AuthContext);

  const triggerUpdateCustomUserData = () => {
    updateCustomUserData();
  };

  return (
    <ProfileNotifications
      userData={userData}
      updateCustomUserData={triggerUpdateCustomUserData}
      userId={userId}
    />
  );
};

export default KonataktEinstellungen;
