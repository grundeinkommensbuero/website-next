import CirclesPink from '@circles-pink/web-client';
import { useContext } from 'react';
import AuthContext from '../../context/Authentication';

const Circles = () => {
  const { customUserData } = useContext(AuthContext);
  return (
    <CirclesPink
      lang="de"
      baseColor="#7d69f6"
      userConfig={{ email: customUserData.email }}
    />
  );
};

export default Circles;
