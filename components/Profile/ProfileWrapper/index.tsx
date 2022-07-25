import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect, ReactElement } from 'react';
import AuthContext from '../../../context/Authentication';
import { useSignatureCountOfUser } from '../../../hooks/Api/Signatures/Get';
import { useBounceToIdentifiedState } from '../../../hooks/Authentication';
import { LinkButtonLocal } from '../../Forms/Button';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { EnterLoginCode } from '../../Login/EnterLoginCode';

type ProfileWrapperProps = {
  children?: ReactElement | ReactElement[] | string;
  id: string;
};

export const ProfileWrapper = ({
  children,
  id: slugId,
}: ProfileWrapperProps) => {
  const {
    userId,
    isAuthenticated,
    setUserId,
    customUserData: userData,
    previousAction,
    setPreviousAction,
  } = useContext(AuthContext);

  const router = useRouter();

  const [, getSignatureCountOfUser] = useSignatureCountOfUser();

  const bounceToIdentifiedState = useBounceToIdentifiedState();

  const [isLoading, setIsLoading] = useState(true);

  // Get user data on page load and handle redirects
  useEffect(() => {
    // If user isn't authenticated
    if (isAuthenticated === false) {
      // If we don't check if the previousAction was signOut
      // we trigger a sign in after user signed out
      if (previousAction !== 'signOut' && slugId) {
        setIsLoading(false);

        // Set user id to slug id, so people get immediately sent the login code.
        // This is relevant if people click a link in a newsletter to update contact settings.
        setUserId(slugId);
      }
    } else if (isAuthenticated) {
      if (userId !== slugId) {
        // We want to tell the user that they are trying to view the page
        // of a different user. Furthermore we want to bounce the user back
        // to the identified state.
        bounceToIdentifiedState();
      } else {
        getSignatureCountOfUser({ userId });
      }

      setIsLoading(false);
    }
  }, [userId, isAuthenticated]);

  // If the user signed out (e.g. through the menu, we want to navigate to homepage)
  useEffect(() => {
    if (previousAction === 'signOut') {
      setIsLoading(true);
      router.push('/');
    }

    // We want to reset previous action in a clean up function
    return () => {
      if (previousAction === 'signOut') {
        setPreviousAction('');
      }
    };
    // eslint-disable-next-line
  }, [previousAction]);

  return (
    <>
      {isLoading && (
        <section>
          <div>
            <h2>Lade...</h2>
          </div>
        </section>
      )}
      {!isLoading && isAuthenticated && <>{children}</>}

      {/* If not authenticated and trying to access different profile show option to go to own user page */}
      {!isLoading && slugId !== userId && (
        <section>
          <FinallyMessage>
            <>
              {userId && (
                <p>
                  Du bist mit der E-Mail-Adresse {userData.email} eingeloggt und
                  versuchst eine andere Profilseite aufzurufen.
                </p>
              )}

              {!userId && (
                <p>
                  Du versuchst auf ein Profil zuzugreifen. Dafür musst dich
                  zuerst einloggen.
                </p>
              )}
            </>
            {/* If user id is undefined we don't want to redirect the next page to be the profile */}
            <LinkButtonLocal
              to={userId ? `/login/?nextPage=mensch%2F${userId}` : '/login'}
            >
              {userId ? 'Zu meinem Profil' : 'Zum Login'}
            </LinkButtonLocal>
          </FinallyMessage>
        </section>
      )}

      {/* If not authenticated show login code */}
      {!isLoading && !isAuthenticated && slugId === userId && (
        <section>
          <EnterLoginCode>
            <p>
              Du bist mit der E-Mail-Adresse {userData.email} eingeloggt. Um
              dich zu identifizieren, haben wir dir einen Code per E-Mail
              geschickt. Bitte gib diesen ein, um dein Profil zu sehen:
            </p>
          </EnterLoginCode>
        </section>
      )}
    </>
  );
};
