import React from 'react';
import { SocialMediaButton } from '../../layout/SocialMedia/Button';
import gS from './style.module.scss';

export const MessengerButtonRow = ({ iconSize }: { iconSize: string }) => {
  return (
    <div className={gS.socialButtonRow}>
      <SocialMediaButton
        icon="WhatsApp"
        link=""
        iconSize={iconSize}
        label=""
        className={gS.messengerIcon}
      />
      <SocialMediaButton
        icon="Telegram"
        link=""
        iconSize={iconSize}
        label=""
        className={gS.messengerIcon}
      />
      <SocialMediaButton
        icon="Facebook"
        link=""
        iconSize={iconSize}
        label=""
        className={gS.messengerIcon}
      />
    </div>
  );
};
