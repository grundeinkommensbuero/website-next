import React, { useState, useEffect, ReactElement, useCallback } from 'react';
import querystring from 'query-string';

import { getCurrentUser, getUser } from '../../hooks/Api/Users/Get';
import { useLocalStorageUser, signOut } from '../../hooks/Authentication';
import { updateUser } from '../../hooks/Api/Users/Update';
import { CognitoUser } from '@aws-amplify/auth';

export interface UserAttributes {
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  updated_at: string;
  'custom:bytesQuota': string;
  'custom:bytesUsed': string;
}

/*
 * The following interface extends the CognitoUser type because it has issues
 * (see github.com/aws-amplify/amplify-js/issues/4927). Eventually (when you
 * no longer get an error accessing a CognitoUser's 'attribute' property) you
 * will be able to use the CognitoUser type instead of CognitoUserExt.
 */
export interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
  signInUserSession: {
    idToken: {
      jwtToken: string;
    };
  };
}

/**
 * This class serves as a provider (reacts context API) which is used
 * to maintain a global state. The application is wrapped around such a provider.
 * https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
 *
 * Another option would be to make use of Amplifys Auth functions, but I think that
 * would be less efficient than keeping an aditional local state
 */

export type SetCognitoUser = React.Dispatch<CognitoUserExt | null> | null;
export type SetUserId = ((userId: string) => void) | null;
export type SetIsAuthenticated = React.Dispatch<boolean | null> | null;
export type SetToken = React.Dispatch<string | null> | null;
export type SetTempEmail = React.Dispatch<string | null> | null;
export type SetPreviousAction = React.Dispatch<string | null> | null;

export type AuthContextType = {
  setTempEmail: SetTempEmail;
  tempEmail: string | null;
  cognitoUser: CognitoUserExt | null;
  setCognitoUser: SetCognitoUser;
  userId: string | null;
  setUserId: SetUserId;
  token: string | null;
  setToken: SetToken;
  isAuthenticated: boolean | null;
  setIsAuthenticated: SetIsAuthenticated;
  customUserData: any | null;
  previousAction: any | null;
  setPreviousAction: SetPreviousAction;
  updateCustomUserData: (() => Promise<void>) | null;
};

const initAuth = {
  setTempEmail: null,
  tempEmail: null,
  cognitoUser: null,
  setCognitoUser: null,
  userId: null,
  setUserId: null,
  token: null,
  setToken: null,
  isAuthenticated: null,
  setIsAuthenticated: null,
  customUserData: null,
  previousAction: null,
  setPreviousAction: null,
  updateCustomUserData: null,
};

const AuthContext = React.createContext<AuthContextType>(initAuth);

type AuthProviderProps = { children: ReactElement };

const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cognitoUser, setCognitoUser] = useState<CognitoUserExt | null>(null);
  const [customUserData, setCustomUserData] = useState<object | null>({});
  const [token, setToken] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [previousAction, setPreviousAction] = useState<string | null>(null);
  const [userId, setUserId] = useLocalStorageUser();

  const signUserOut = useCallback(
    async () =>
      await signOut({
        setCognitoUser,
        setUserId,
        setIsAuthenticated,
        setToken,
        setTempEmail,
        setPreviousAction,
      }),
    [setUserId]
  );

  // On page load
  useEffect(() => {
    // Check for URL param for userId
    const params = querystring.parse(window.location.search);
    // If there is a userId in the params
    let userIdParams: string = '';
    if (params.userId) {
      if (userId !== undefined && typeof params.userId === 'string')
        userIdParams = params.userId;
      // if userId in params is different than in state
      if (typeof params.userId === 'string' && userIdParams !== params.userId)
        userIdParams = params.userId;
    }
    // If userId in params but no userId in local storage
    if (userIdParams && !userId) {
      // Set user as pseudo logged in
      if (
        setUserId &&
        typeof setUserId !== 'string' &&
        typeof userIdParams === 'string'
      )
        setUserId(userIdParams);
      setIsAuthenticated(false);
    }
    // If userId in params and userId in local storage and they don't match
    else if (userIdParams && userId && userIdParams !== userId) {
      // Sign current user out
      signUserOut().then(() => {
        // Set new userId so user is pseudo logged in. Can force a second sign out if invalid id.
        if (setUserId && typeof setUserId !== 'string') setUserId(userIdParams);
      });
    }
    // In any other case, check for authenticated user
    else {
      if (typeof window !== `undefined`) {
        // Check if the user is already signed in
        import(/* webpackChunkName: "Amplify" */ '@aws-amplify/auth').then(
          ({ default: Amplify }) => {
            Amplify.currentAuthenticatedUser()
              .then(user => {
                if (user) {
                  setCognitoUser(user);
                }
              }) // set user in context (global state)
              .catch(() => {
                //error is thrown if user is not authenticated
                setIsAuthenticated(false);
              });
          }
        );
      }
    }
  }, [setUserId, signUserOut, userId]);

  /*
   * Custom attributes type defined according to the attributes used in this app
   */

  useEffect(() => {
    // If identified cognito user
    if (cognitoUser && cognitoUser.attributes) {
      // Set user data
      setIsAuthenticated(true);
      setToken(cognitoUser.signInUserSession.idToken.jwtToken);
      // If userId needs to be overriddenz
      if (
        cognitoUser.attributes.sub !== userId &&
        setUserId &&
        typeof setUserId !== 'string'
      ) {
        setUserId(cognitoUser.attributes.sub);
      }
    }
  }, [cognitoUser, setUserId, userId]);

  // Getting user data from backend
  useEffect(() => {
    if (userId && isAuthenticated !== undefined) {
      updateCustomUserData({
        isAuthenticated,
        token,
        userId,
        setCustomUserData,
        signUserOut,
      });

      if (isAuthenticated) {
        // Update user in db to leave a "trace" that they've been active
        const store = { lastActivity: new Date().toISOString() };
        if (token) updateUser({ userId, token, store });
      }
    } else if (!userId && !isAuthenticated) {
      // If userId is not set and is Authenticated is not true,
      // we want to reset userData (this would happen after a signout)
      setCustomUserData({});
    }
  }, [userId, isAuthenticated, signUserOut, token]);

  return (
    <AuthContext.Provider
      value={{
        cognitoUser,
        setCognitoUser,
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        userId,
        setUserId,
        tempEmail,
        setTempEmail,
        customUserData,
        previousAction,
        setPreviousAction,
        updateCustomUserData: () =>
          updateCustomUserData({
            isAuthenticated,
            token,
            setCustomUserData,
            userId,
            signUserOut,
          }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

type UpdateCustomUserDataArgs = {
  isAuthenticated: boolean | null;
  token: string | null;
  setCustomUserData: React.Dispatch<object | null>;
  userId: string | ((userId: string) => void) | null;
  signUserOut: () => void;
};

// Updates user data with data from backend
const updateCustomUserData = async ({
  isAuthenticated,
  token,
  setCustomUserData,
  userId,
  signUserOut,
}: UpdateCustomUserDataArgs) => {
  try {
    if (!token || !userId || typeof userId !== 'string') return;
    // Get user data from protected or public endpoint
    const result = isAuthenticated
      ? await getCurrentUser(token)
      : await getUser(userId);

    if (
      (result &&
        // If error finding user data
        result.state !== 'success') ||
      // If user logged in different userId passed in params
      (result && isAuthenticated && userId !== result.user.cognitoId) ||
      // User doesn't have email or password
      (result && !result.user?.email && !result.user?.username)
    ) {
      signUserOut();
      return;
    }

    // If no error, update custom user data
    if (result) setCustomUserData(result.user);
  } catch (error) {
    console.log(error);
  }
};

export default AuthContext;
export { AuthProvider };
