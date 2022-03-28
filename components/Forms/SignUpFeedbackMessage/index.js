import React from 'react';
import { FinallyMessage } from '../FinallyMessage';
import { trackEvent, addActionTrackingId } from '../../utils';
import { LinkButton } from '../Button';

export default ({ className, state, trackingId, trackingCategory }) => {
  let finallyState;
  if (state === 'saved' || state === 'updated' || state === 'success') {
    finallyState = 'success';
    trackEvent({
      category: trackingCategory,
      action: addActionTrackingId('sentSuccess', trackingId),
    });
  }
  if (state === 'error' || state === 'userExists') {
    finallyState = 'error';
    trackEvent({
      category: trackingCategory,
      action: addActionTrackingId('sentError', trackingId),
      name: state,
    });
  }
  if (state === 'saving' || state === 'loading') {
    finallyState = 'progress';
  }
  return (
    <div className={className}>
      <FinallyMessage state={finallyState}>
        {finallyState === 'progress' && 'Wird abgeschickt...'}

        {(state === 'saved' || state === 'success') && (
          <>
            Yay, danke für deine Anmeldung!
            <br />
            <br />
            Wir sind gemeinnützig und auf Spenden angewiesen. Bitte unterstütze
            uns auch finanziell!
            <br />
            <br />
            <LinkButton href="/spenden">Jetzt spenden</LinkButton>
          </>
        )}
        {state === 'signedIn' && (
          <>
            Du hast dich erfolgreich angemeldet. Schön, dass du wieder da bist.
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
      </FinallyMessage>
    </div>
  );
};
