import React from 'react';
import { SocialMediaButton } from '../Button';

export const Follow = ({ className }: { className: string }) => (
  <div className={className + ' flex justify-center'}>
    <SocialMediaButton
      icon="Instagram"
      link="https://www.instagram.com/hamburg.testet.grundeinkommen/"
      label="Folge auf Instagram"
    />
    <SocialMediaButton
      icon="Facebook"
      link="https://www.facebook.com/hamburg.testet.grundeinkommen"
      label="Folge auf Facebook"
    />
    <SocialMediaButton
      icon="Youtube"
      link="https://www.youtube.com/channel/UCOxYY2kaKTBz2FSnk83qFDA"
      label="Folge auf Youtube"
    />
    <SocialMediaButton
      icon="X"
      link="https://x.com/expeditionbge"
      label="Folge auf X"
    />
  </div>
);

export const FollowHamburg = ({ className }: { className: string }) => (
  <div className={className + ' flex justify-center'}>
    <SocialMediaButton
      icon="InstagramHamburg"
      link="https://www.instagram.com/hamburg.testet.grundeinkommen/"
      label="Folge uns auf Instagram"
    />
    <SocialMediaButton
      icon="TiktokHamburg"
      link="https://www.tiktok.com/@hhtestetgrundeinkommen"
      label="Folge uns auf Tiktok"
    />
    <SocialMediaButton
      icon="FacebookHamburg"
      link="https://www.facebook.com/hamburg.testet.grundeinkommen"
      label="Folge uns auf Facebook"
    />
    <SocialMediaButton
      icon="YoutubeHamburg"
      link="https://www.youtube.com/@expeditiongrundeinkommen7639"
      label="Folge uns auf Youtube"
    />
    <SocialMediaButton
      icon="XHamburg"
      link="https://twitter.com/expeditionbge"
      label="Folge uns auf X"
    />
  </div>
);
