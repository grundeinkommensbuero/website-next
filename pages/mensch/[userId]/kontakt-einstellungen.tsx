import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileNotifications } from '../../../components/Profile/ProfileNotifications';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';

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
    <ProfileWrapper id={userId}>
      <ProfileNotifications
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </ProfileWrapper>
  );
};

export default KonataktEinstellungen;
