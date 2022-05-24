import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Profile from '../../../components/Profile/ProfileWrapper';
import { withAuth } from '../../../components/Util/withAuth';
import { withAuthSSR } from '../../../components/Util/withAuthSSR';
import { Layout } from '../../../layout';
import { Mainmenu } from '../../../utils/getMenus';

const ProfilePage = ({ mainmenu }: { mainmenu: Mainmenu }): ReactElement => {
  const router = useRouter();
  const { userId } = router.query as { userId: string };

  return (
    <Layout mainmenu={mainmenu}>
      <Profile id={userId} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthSSR();

export default withAuth(ProfilePage);
