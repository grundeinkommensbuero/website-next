import { useContext } from 'react';
import { PersonalSettings } from '../../../components/Profile/PersonalSettings';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';
import AuthContext from '../../../context/Authentication';

const Stammdaten = () => {
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
      <PersonalSettings
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
        userId={userId}
      />
    </ProfileWrapper>
  );
};

export default Stammdaten;
