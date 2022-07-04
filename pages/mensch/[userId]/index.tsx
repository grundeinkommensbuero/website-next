import { useRouter } from 'next/router';
import { ReactElement, useContext, useEffect } from 'react';
import { ProfileOverview } from '../../../components/Profile/ProfileOverview';
import { ProfileWrapper } from '../../../components/Profile/ProfileWrapper';
import AuthContext from '../../../context/Authentication';
import { useSignatureCountOfUser } from '../../../hooks/Api/Signatures/Get';

const ProfilePage = (): ReactElement => {
  const router = useRouter();
  const { userId: queryUserId } = router.query as { userId: string };
  const {
    userId,
    customUserData: userData,
    isAuthenticated,
  } = useContext(AuthContext);

  const [signatureCountOfUser, getSignatureCountOfUser] =
    useSignatureCountOfUser();

  useEffect(() => {
    if (isAuthenticated) {
      getSignatureCountOfUser({ userId });
    }
  }, [userId, isAuthenticated]);

  return (
    <ProfileWrapper id={queryUserId}>
      <ProfileOverview
        userData={userData}
        userId={userId}
        signatureCountOfUser={signatureCountOfUser}
      />
    </ProfileWrapper>
  );
};

export default ProfilePage;
