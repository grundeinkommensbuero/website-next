/**
 * This file holds several hook functions regarding everything concerning authentication
 */
import { getRandomString } from '../../utils/getRandomString';
import { sleep, getReferral } from '../utils';
import React, { useContext, useState } from 'react';
import querystring from 'query-string';
import { navigate } from '@reach/router';
import { TrackJS } from 'trackjs';
import AuthContext, {
  SetCognitoUser,
  SetIsAuthenticated,
  SetPreviousAction,
  SetTempEmail,
  SetToken,
  SetUserId,
} from '../../context/Authentication';
import { createUser } from '../Api/Users/Create';
import CONFIG from '../../backend-config';
import { CognitoUser } from '@aws-amplify/auth';
import { Request } from './Verification';
export { useAnswerChallenge } from './AnswerChallenge';
export { useVerification } from './Verification';
export { useLocalStorageUser } from './LocalStorageUser';

export const useSignUp = () => {
  const [state, setState] = useState<string | undefined>();
  const [userExists, setUserExists] = useState<boolean | undefined>();

  //get global context
  const context = useContext(AuthContext);

  return [
    state,
    userExists,
    (data: {}) => startSignInProcess(data, setState, setUserExists, context),
    setState,
  ];
};

export const useSignIn = () => {
  const [state, setState] = useState<string | undefined>();

  //get global context
  const { tempEmail, ...context } = useContext(AuthContext);

  return [
    state,
    () => {
      setState('loading');

      if (!tempEmail) return;

      signIn({ email: tempEmail }, context)
        .then(() => {
          setState('success');
        })
        .catch(error => {
          if (error.message === 'UserNotFoundException') {
            setState('userNotFound');
          } else {
            setState('error');
            TrackJS.track(error);
            console.log('Error while signing in', error);
          }
        });
    },
  ];
};

// hook for signing out
// in comparison to other hooks we only return the function, no state
export const useSignOut = () => {
  //get global context
  const context = useContext(AuthContext);

  return () => signOut(context);
};

// This hook signs the user out of amplify session,
// while keeping the user in the identified state (keeping user id in context).
// Same as sign out hook we only return the function.
export const useBounceToIdentifiedState = () => {
  //get global context
  const context = useContext(AuthContext);

  return () => bounceToIdentifiedState(context);
};

export const useChangeEmail = () => {
  const [state, setState] = useState<string | undefined>();

  //get global context
  const { cognitoUser } = useContext(AuthContext);

  return [
    state,
    (email: string) => changeEmail(email, setState, cognitoUser),
    setState,
  ];
};

export const useValidateNewEmail = () => {
  const [state, setState] = useState<string | undefined>();

  //get global context
  const { cognitoUser } = useContext(AuthContext);

  return [
    state,
    (code: string) => validateNewEmail(code, setState, cognitoUser),
  ];
};

const startSignInProcess = async (
  data: any,
  setState: React.Dispatch<string | undefined>,
  setUserExists: React.Dispatch<boolean | undefined>,
  context: any
) => {
  try {
    setState('loading');

    await signUp(data, context);

    // User did not exist
    await signIn(data, context);

    setUserExists(false);
    setState('success');
  } catch (error: any) {
    // We have to check, if the error happened due to the user already existing.
    // If that's the case we call signIn() anyway.
    if (error.code === 'UsernameExistsException') {
      try {
        await signIn(data, context);

        setUserExists(true);
        setState('success');
      } catch (error) {
        console.log('Error while signing in', error);
        setState('error');
      }
    } else if (
      error.code === 'TooManyRequestsException' ||
      error.code === 'ThrottlingException'
    ) {
      // If the limit of cognito requests was reached we want to wait shortly and try again
      await sleep(1500);
      return signUp(data.email, context);
    } else {
      console.log('Error while signing up', error);
      setState('error');
    }
  }
};

// Amplifys Auth class is used to sign up user
const signUp = async (
  data: { referral: string | (string | null)[] | null; email: string },
  { setUserId }: { setUserId: React.Dispatch<string | undefined> }
) => {
  const { default: Auth } = await import(
    /* webpackChunkName: "Amplify" */ '@aws-amplify/auth'
  );

  // We have to “generate” a password for them, because a password is required by Amazon Cognito when users sign up
  const { userSub: userId } = await Auth.signUp({
    username: data.email.toLowerCase(),
    password: getRandomString(30),
  });

  data.referral = getReferral();

  // After we signed up via cognito, we want to create the user in dynamo
  await createUser({ userId, ...data });

  //we want to set the newly generated id
  setUserId(userId);
};

// Sign in user through api endpoint
const signIn = async (
  { email }: { email: string },
  {
    setTempEmail,
    userId,
  }: {
    setTempEmail: ((tempEmail: string) => void) | null;
    userId: string | null;
  }
) => {
  const body: {
    email?: string;
    userId?: string | null;
  } = {};

  if (email) {
    body.email = email.toLowerCase();
  } else {
    body.userId = userId;
  }

  const request: Request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(
    `${CONFIG.API.INVOKE_URL}/users/sign-in`,
    request
  );

  if (response.status === 500) {
    throw new Error('InternalServerException');
  }

  if (response.status === 404) {
    throw new Error('UserNotFoundException');
  }

  // We need the temp mail later in the answer challenge function when we call
  // the actual signIn function of Amplify
  if (email && setTempEmail) {
    setTempEmail(email);
  }
};

//Function, which uses the amplify api to sign out user
export const signOut = async ({
  setCognitoUser,
  setUserId,
  setIsAuthenticated,
  setToken,
  setTempEmail,
  setPreviousAction,
}: {
  setCognitoUser: SetCognitoUser;
  setUserId: SetUserId;
  setIsAuthenticated: SetIsAuthenticated;
  setToken: SetToken;
  setTempEmail: SetTempEmail;
  setPreviousAction: SetPreviousAction;
}) => {
  try {
    const { default: Auth } = await import(
      /* webpackChunkName: "Amplify" */ '@aws-amplify/auth'
    );

    await Auth.signOut();

    // Remove URL params if existing
    const params = querystring.parse(window.location.search);
    if (params.userId) {
      params.userId = null;
      const newUrl = `?${querystring.stringify(params)}`;
      navigate(newUrl, { replace: true });
    }

    // Update user state
    if (setCognitoUser) setCognitoUser(null);
    if (setUserId) setUserId('');
    if (setToken) setToken(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    if (setTempEmail) setTempEmail(null);
    if (setPreviousAction) setPreviousAction('signOut');
    return;
  } catch (error) {
    console.log('Error while signing out', error);
  }
};

// This function signs the user out of amplify session,
// while keeping the user in the identified state (keeping user id in context)
const bounceToIdentifiedState = async ({
  setCognitoUser,
  setToken,
  setIsAuthenticated,
}: {
  setCognitoUser: SetCognitoUser;
  setIsAuthenticated: SetIsAuthenticated;
  setToken: SetToken;
}) => {
  try {
    const { default: Auth } = await import(
      /* webpackChunkName: "Amplify" */ '@aws-amplify/auth'
    );

    await Auth.signOut();

    // Update user state
    if (setCognitoUser) setCognitoUser(null);
    if (setToken) setToken(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
  } catch (error) {
    console.log('Error while bouncing user to identified state', error);
  }
};

const changeEmail = async (
  email: string,
  setState: React.Dispatch<string>,
  cognitoUser: CognitoUser | null
) => {
  try {
    setState('loading');
    const { default: Auth } = await import(
      /* webpackChunkName: "Amplify" */ '@aws-amplify/auth'
    );

    await Auth.updateUserAttributes(cognitoUser, { email });
    setState('success');
  } catch (error: any) {
    if (error.code === 'AliasExistsException') {
      setState('emailExists');
    } else {
      setState('error');
    }

    console.log('Error while changing email', error);
  }
};

const validateNewEmail = async (
  code: string,
  setState: React.Dispatch<string>,
  cognitoUser: CognitoUser | null
) => {
  try {
    setState('loading');
    const { default: Auth } = await import(
      /* webpackChunkName: "Amplify"import { CognitoUser } from '@aws-amplify/auth';
       */ '@aws-amplify/auth'
    );

    await Auth.verifyUserAttributeSubmit(cognitoUser, 'email', code);
    setState('success');
  } catch (error: any) {
    if (
      error.code === 'CodeMismatchException' ||
      error.code === 'ExpiredCodeException'
    ) {
      setState('wrongCode');
    } else {
      setState('error');
    }
    console.log('Error while verifying new email', error);
  }
};
