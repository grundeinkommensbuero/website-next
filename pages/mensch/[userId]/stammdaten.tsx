import { useContext } from 'react';
import { PersonalSettings } from '../../../components/Profile/PersonalSettings';
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
    <PersonalSettings
      userData={userData}
      updateCustomUserData={triggerUpdateCustomUserData}
      userId={userId}
    />
  );
};

export default Stammdaten;
