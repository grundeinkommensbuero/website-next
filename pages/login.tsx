import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { RequestLoginCodeWithEmail } from '../components/Login/RequestLoginCode';
import { withAuth } from '../components/Util/withAuth';
import { withAuthSSR } from '../components/Util/withAuthSSR';
import { Layout } from '../layout';
import { Mainmenu } from '../utils/getMenus';

const Login = ({ mainmenu }: { mainmenu: Mainmenu }): ReactElement => {
  return (
    <Layout mainmenu={mainmenu}>
      <div className="pageWidth colorSchemeWhite">
        <div className="m-16">
          <RequestLoginCodeWithEmail>
            <h3>Hey! Schön, dass du da bist. Hier geht&apos;s zum Login.</h3>
          </RequestLoginCodeWithEmail>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthSSR();

export default withAuth(Login);
