import React, { useEffect, useContext } from 'react';
import AuthContext, {
  AuthProvider,
  CognitoUserExt,
  User,
} from '../../context/Authentication';

/**
 * This pattern is influenced by the next firebase auth package:
 * https://github.com/gladly-team/next-firebase-auth
 *
 * This higher order function should be called by getServerSideProps
 * and can be wrapped around another function to get different ssr props
 */

export const withAuth = (Component: any) => {
  const WithAuthHOC = (props: {
    isAuthenticated: boolean;
    userData: User;
    cognitoUser: CognitoUserExt;
  }) => {
    const { userData, isAuthenticated, ...otherProps } = props;

    return (
      <AuthProvider
        defaultUserData={userData}
        defaultIsAuthenticated={isAuthenticated}
      >
        <Component {...otherProps} />
      </AuthProvider>
    );
  };

  return WithAuthHOC;
};
