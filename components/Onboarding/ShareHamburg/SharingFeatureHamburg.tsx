import React from 'react';
import SocialMediaShareButtons from './SocialMediaShareButtons';
import { shareMessage, shareMessageShort, shareUrl } from './shareMessage';
import CopyShareMessageBox from './CopyShareMessageBox';

const SharingFeatureHamburg = () => {
  return (
    <div>
      <p>
        Damit genug Menschen bei der Abstimmung mitmachen, ist es wichtig, dass
        du die Kampagne teilst. Such dir einen Kanal aus und leg los:
      </p>
      <SocialMediaShareButtons
        shareMessage={shareMessage}
        shareMessageShort={shareMessageShort}
        shareUrl={shareUrl}
      />
      <h3>
        <b>Oder: Text kopieren</b>
      </h3>
      <p>
        Wenn du möchtest, kannst du dir auch einen kurzen Text selbst kopieren
        und auf einer Plattform deiner Wahl teilen:
      </p>
      <CopyShareMessageBox shareMessage={shareMessage} />
    </div>
  );
};

export default SharingFeatureHamburg;
