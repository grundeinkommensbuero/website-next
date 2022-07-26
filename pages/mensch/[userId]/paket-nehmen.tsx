import { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';
import { ProfilePledgePackage } from '../../../components/Profile/ProfilePledgePackage';

const CreatePackagePage = () => {
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
      <ProfilePledgePackage
        userData={userData}
        updateCustomUserData={triggerUpdateCustomUserData}
      />
    </ProfileWrapper>
  );
};

export default CreatePackagePage;
