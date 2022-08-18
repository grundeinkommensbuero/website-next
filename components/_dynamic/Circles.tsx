// TS declaration file will follow soon
//@ts-ignore
import CirclesPink from '@circles-pink/web-client';
import { useContext } from 'react';
import AuthContext from '../../context/Authentication';
import { NoSsr } from '../Util/NoSsr';

const Circles = () => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {isAuthenticated ? (
        <NoSsr>
          {window && (
            <CirclesPink
              lang="de"
              baseColor="#FB8298"
              email={`user-${userId}@xbge.de`}
              voucherServerEnabled={false}
            />
          )}
        </NoSsr>
      ) : (
        <p>Bitte melde dich an!</p>
      )}
    </>
  );
};

export default Circles;
