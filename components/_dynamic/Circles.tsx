// TS declaration file will follow soon
//@ts-ignore
import CirclesPink from '@circles-pink/web-client';
import { useContext } from 'react';
import AuthContext from '../../context/Authentication';

const Circles = () => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {isAuthenticated ? (
        <CirclesPink
          lang="de"
          baseColor="#7d69f6"
          email={`user-${userId}@xbge.de`}
          voucherServerEnabled={false}
        />
      ) : (
        <p>Bitte melde dich an!</p>
      )}
    </>
  );
};

export default Circles;
