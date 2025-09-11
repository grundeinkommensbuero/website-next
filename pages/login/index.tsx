import { ReactElement, useContext, useEffect, useState } from 'react';
import { RequestLoginCodeWithEmail } from '../../components/Login/RequestLoginCode';
import querystring from 'query-string';
import AuthContext from '../../context/Authentication';
import { useRouter } from 'next/router';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import s from './style.module.scss';
import cN from 'classnames';
import NotFound from '../../components/NotFound';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const Login = (): ReactElement => {
  const { isAuthenticated, setTempEmail } = useContext(AuthContext);
  const [nextPageParam, setNextPageParam] = useState<string>();
  const router = useRouter();

  // Remove tempEmail when user navigates away
  useEffect(() => {
    return () => {
      setTempEmail('');
    };
  }, []);

  // Get next page from query params
  useEffect(() => {
    const params =
      // Check for window to make sure that build works
      typeof window !== `undefined`
        ? // If window, parse params
          querystring.parse(window.location.search)
        : undefined;

    if (params?.nextPage && typeof params.nextPage === 'string') {
      setNextPageParam(params.nextPage);
    }
  }, []);

  // If user is authenticated, navigate to home page or the specified next page
  if (isAuthenticated === true) {
    router.push(nextPageParam ? `/${nextPageParam}` : '/');
  }

  if (true) {
    return <NotFound />; // Disabling login page for now
  }
  return (
    <section
      className={cN(s.wrapper, {
        colorSchemeRose: IS_BERLIN_PROJECT,
        colorSchemeViolet: !IS_BERLIN_PROJECT,
      })}
    >
      <div className={s.content}>
        {/* This condition is useful, if a user opens the /login page while
        authenticated, because then the login form would flash before navigating */}
        {isAuthenticated === false ? (
          <RequestLoginCodeWithEmail inputClassName={s.input} />
        ) : (
          <LoadingAnimation />
        )}
      </div>
    </section>
  );
};

export default Login;
