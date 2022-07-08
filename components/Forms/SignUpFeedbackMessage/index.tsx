import React from 'react';
import { FinallyMessage } from '../FinallyMessage';
import { LinkButton } from '../Button';

type SignUpFeedbackProps = {
  className?: string;
  state:
    | 'saved'
    | 'updated'
    | 'success'
    | 'error'
    | 'userExists'
    | 'saving'
    | 'loading'
    | 'signedIn';
};

const SignUpFeedbackMessage = ({ className, state }: SignUpFeedbackProps) => {
  let finallyState = null;

  if (state === 'saved' || state === 'updated' || state === 'success') {
    finallyState = 'success';
  }
  if (state === 'error' || state === 'userExists') {
    finallyState = 'error';
  }
  if (state === 'saving' || state === 'loading') {
    finallyState = 'progress';
  }

  return (
    <div className={className}>
      <FinallyMessage loading={finallyState === 'progress'}>
        <>
          {finallyState === 'progress' && 'Wird abgeschickt...'}

          {(state === 'saved' || state === 'success') && (
            <>
              Yay, danke für deine Anmeldung!
              <br />
              <br />
              Wir sind gemeinnützig und auf Spenden angewiesen. Bitte
              unterstütze uns auch finanziell!
              <br />
              <br />
              <LinkButton href="/spenden">Jetzt spenden</LinkButton>
            </>
          )}
          {state === 'signedIn' && (
            <>
              Du hast dich erfolgreich angemeldet. Schön, dass du wieder da
              bist.
            </>
          )}
          {state === 'error' && (
            <>
              Da ist was schief gegangen. Melde dich bitte bei uns{' '}
              <a href="mailto:support@expedition-grundeinkommen.de">
                support@expedition-grundeinkommen.de
              </a>
              .
            </>
          )}
        </>
      </FinallyMessage>
    </div>
  );
};

export default SignUpFeedbackMessage;
