import React, { useState, useEffect, ReactElement } from 'react';
import querystring from 'query-string';

import { getCurrentUser, getUser } from '../../hooks/Api/Users/Get';
import { useLocalStorageUser, signOut } from '../../hooks/Authentication/';
import { updateUser } from '../../hooks/Api/Users/Update';
import { CognitoUser } from '@aws-amplify/auth';

/**
 * This class serves as a provider (reacts context API) which is used
 * to maintain a global state. The application is wrapped around such a provider.
 * https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
 *
 * Another option would be to make use of Amplifys Auth functions, but I think that
 * would be less efficient than keeping an aditional local state
 */

export type SetCognitoUser = React.Dispatch<CognitoUser | null> | null;
export type SetUserId = React.Dispatch<string | undefined> | null;
export type SetIsAuthenticated = React.Dispatch<boolean | null> | null;
export type SetToken = React.Dispatch<string | undefined> | null;
export type SetTempEmail = React.Dispatch<string | undefined> | null;
export type SetPreviousAction = React.Dispatch<string | undefined> | null;

export type AuthContextType = {
  setTempEmail: SetTempEmail;
  tempEmail: string | null;
  cognitoUser: CognitoUser | null;
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
  updateCustomUserData: (() => React.Dispatch<any | null>) | null;
};

const initAuth = {
  setTempEmail: null,
  tempEmail: null,
  cognitoUser: null,
  setCognitoUser: null,
  userId: null,
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

const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
  const [cognitoUser, setCognitoUser] = useState<string | undefined>();
  const [customUserData, setCustomUserData] = useState<{}>({});
  const [token, setToken] = useState<string | undefined>();
  const [tempEmail, setTempEmail] = useState<string | undefined>();
  const [previousAction, setPreviousAction] = useState<string | undefined>();
  const [userId, setUserId] = useLocalStorageUser();

  const signUserOut = async () =>
    await signOut({ setCognitoUser, setUserId, setIsAuthenticated, setToken });

  // On page load
  useEffect(() => {
    // Check for URL param for userId
    const params = querystring.parse(window.location.search);
    // If there is a userId in the params
    let userIdParams;
    if (params.userId) {
      if (userId !== undefined) userIdParams = params.userId;
      // if userId in params is different than in state
      if (userIdParams !== params.userId) userIdParams = params.userId;
    }
    // If userId in params but no userId in local storage
    if (userIdParams && !userId) {
      // Set user as pseudo logged in
      setUserId(userIdParams);
      setIsAuthenticated(false);
    }
    // If userId in params and userId in local storage and they don't match
    else if (userIdParams && userId && userIdParams !== userId) {
      // Sign current user out
      signUserOut().then(() => {
        // Set new userId so user is pseudo logged in. Can force a second sign out if invalid id.
        setUserId(userIdParams);
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
  }, []);

  useEffect(() => {
    // If identified cognito user
    if (cognitoUser && cognitoUser.attributes) {
      // Set user data
      setIsAuthenticated(true);
      setToken(cognitoUser.signInUserSession.idToken.jwtToken);
      // If userId needs to be overriddenz
      if (cognitoUser.attributes.sub !== userId) {
        setUserId(cognitoUser.attributes.sub);
      }
    }
  }, [cognitoUser]);

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
        updateUser({ userId, token, store });
      }
    } else if (!userId && !isAuthenticated) {
      // If userId is not set and is Authenticated is not true,
      // we want to reset userData (this would happen after a signout)
      setCustomUserData({});
    }
  }, [userId, isAuthenticated]);

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

// Updates user data with data from backend
const updateCustomUserData = async ({
  isAuthenticated,
  token,
  setCustomUserData,
  userId,
  signUserOut,
}) => {
  try {
    // Get user data from protected or public endpoint
    const result = isAuthenticated
      ? await getCurrentUser(token)
      : await getUser(userId);
    if (
      // If error finding user data
      result.state !== 'success' ||
      // If user logged in different userId passed in params
      (isAuthenticated && userId !== result.user.cognitoId) ||
      // User doesn't have email or password
      (!result.user?.email && !result.user?.username)
    ) {
      signUserOut();
      return;
    }

    // If no error, update custom user data
    setCustomUserData(result.user);
  } catch (error) {
    console.log(error);
  }
};

export default AuthContext;
export { AuthProvider };
