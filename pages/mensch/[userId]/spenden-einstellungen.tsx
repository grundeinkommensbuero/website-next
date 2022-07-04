import { useContext } from 'react';
import { ProfileDonationSettings } from '../../../components/Profile/ProfileDonationSettings';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';
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
    <ProfileWrapper id={userId}>
      <ProfileDonationSettings
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </ProfileWrapper>
  );
};

export default SpendenEinstellungen;
