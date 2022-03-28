import { ReactElement } from 'react';
import { RequestLoginCodeWithEmail } from '../components/Login/RequestLoginCode';

const Login = (): ReactElement => {
  return (
    <div className="pageWidth colorSchemeWhite">
      <div className="m-16">
        <RequestLoginCodeWithEmail>
          <h3>Hey! Schön, dass du da bist. Hier geht&apos;s zum Login.</h3>
        </RequestLoginCodeWithEmail>
      </div>
    </div>
  );
};

export default Login;
