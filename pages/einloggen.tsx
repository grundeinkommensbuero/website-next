import { ReactElement, useContext, useState } from 'react';
import { AuthContext } from '../context/Authentication';

const Login = (): ReactElement => {
  const [email, setEmail] = useState<string>('');
  const { setTempEmail } = useContext(AuthContext);

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
        <span className="ml-4">{email}</span>
      </div>
    </div>
  );
};

export default Login;
