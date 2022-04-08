import { useContext } from 'react';
import { ProfileDonationSettings } from '../../../components/Profile/ProfileDonationSettings';
import AuthContext from '../../../context/Authentication';

const SpendenEinstellungen = () => {
  const {
    userId,
    customUserData: userData,
    updateCustomUserData,
  } = useContext(AuthContext);

  const triggerUpdateCustomUserData = () => {
    updateCustomUserData();
  };

  return (
    <ProfileDonationSettings
      userData={userData}
      updateCustomUserData={triggerUpdateCustomUserData}
      userId={userId}
    />
  );
};

export default SpendenEinstellungen;
