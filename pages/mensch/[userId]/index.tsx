import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Profile from '../../../components/Profile/ProfileWrapper';

const ProfilePage = (): ReactElement => {
  const router = useRouter();
  const { userId } = router.query as { userId: string };

  return <Profile id={userId} />;
};

export default ProfilePage;
