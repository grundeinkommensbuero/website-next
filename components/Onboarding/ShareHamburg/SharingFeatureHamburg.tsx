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
      <h3>
        <b>Teil die Kampagne auch auf nebenan.de!</b>
      </h3>
      <p>
        Kennst du schon das Nachbarschafts-Netzwerk{' '}
        <a href="https://nebenan.de/">nebenan.de</a>? Dort kannst du deine
        Nachbarn direkt erreichen. <a href="nebenan">Schau mal hier vorbei</a>,
        um einen Share-Text zu finden und ihn zu teilen.
      </p>
    </div>
  );
};

export default SharingFeatureHamburg;
