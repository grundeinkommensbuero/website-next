import { ReactElement, useContext, useState } from 'react';
import { AuthContext } from '../context/Authentication';
import { useSignIn, useAnswerChallenge } from '../hooks/Authentication';
import { Button } from '../components/Forms/Button/index';
import { RequestLoginCodeWithEmail } from '../components/Login/RequestLoginCode';

const Login = (): ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const { setTempEmail, userId, customUserData } = useContext(AuthContext);
  const [state, startSignIn] = useSignIn();
  const [codeState, sendCode] = useAnswerChallenge();

  return (
    <div className="pageWidth colorSchemeWhite">
      <div className="m-16">
        <RequestLoginCodeWithEmail>
          <h3>Hey! Schön, dass du da bist. Hier geht&apos;s zum Login.</h3>
        </RequestLoginCodeWithEmail>
        {/* <div className="p-2">
          <input
            placeholder="E-Mail Adresse"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (setTempEmail) setTempEmail(e.currentTarget.value);
              setEmail(e.currentTarget.value);
            }}
          />
          <span className="ml-4">
            {email} {state}
          </span>
        </div>

        <br />
        {email && (
          <div className="p-2">
            <Button onClick={() => startSignIn()}>Submit</Button>
          </div>
        )}
        {state === 'success' && (
          <input
            placeholder="Code"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setCode(e.currentTarget.value);
            }}
          />
        )}
        {code && (
          <div className="p-2">
            <Button onClick={() => sendCode(code)}>Submit</Button>
          </div>
        )} */}
        {/* {userId && <>{userId}</>}
        {customUserData && <>{JSON.stringify(customUserData, null, 2)}</>} */}
      </div>
    </div>
  );
};

export default Login;
