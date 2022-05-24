import { getCurrentUser } from './../../hooks/Api/Users/Get/index';
import { CognitoUserExt } from './../../context/Authentication/index';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withSSRContext, Amplify } from 'aws-amplify';

/**
 * This pattern is influenced by the next firebase auth package:
 * https://github.com/gladly-team/next-firebase-auth
 *
 * This higher order function should be called by getServerSideProps
 * and can be wrapped around another function to get different ssr props
 */

export const withAuthSSR = (
  getServerSidePropsFunction?: GetServerSideProps
) => {
  return async (context: GetServerSidePropsContext) => {
    const { Auth } = withSSRContext(context);

    let data;
    try {
      const cognitoUser: CognitoUserExt = await Auth.currentAuthenticatedUser();

      const res: any = await getCurrentUser(
        cognitoUser.signInUserSession.idToken.jwtToken
      );

      data = {
        props: {
          isAuthenticated: true,
          userData: res.user,
        },
      };
    } catch (err) {
      console.log('error', err);
      data = {
        props: {
          isAuthenticated: false,
        },
      };
    }

    // Now we need to call the wrapped server side function and compose the props
    if (getServerSidePropsFunction) {
      // TODO: get GetServerSidePropsResult to work
      const composedProps: any =
        (await getServerSidePropsFunction(context)) || {};

      if (composedProps.props) {
        data.props = { ...data.props, ...composedProps.props };
      }
    }

    return data;
  };
};
