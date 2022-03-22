import { ReactElement, useContext, useState } from 'react';
import { AuthContext } from '../context/Authentication';
import { useSignIn, useAnswerChallenge } from '../hooks/Authentication';

const Login = (): ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const { setTempEmail, userId, customUserData } = useContext(AuthContext);
  const [state, startSignIn] = useSignIn();
  const [codeState, sendCode] = useAnswerChallenge();

  return (
    <div className="pageWidth">
      <h1 className="mt-16">login goes here :)</h1>
      <div className="mb-16">
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
        {email && (
          <div>
            <button onClick={() => startSignIn()}>Submit</button>
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
        {/* {code && (
          <div>
            <button onClick={() => sendCode(code)}>Submit</button>
          </div>
        )}
        {userId && <>{userId}</>}
        {customUserData && <>{JSON.stringify(customUserData, null, 2)}</>} */}
      </div>
    </div>
  );
};

export default Login;
