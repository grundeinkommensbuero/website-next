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
      icon="Twitter"
      link="https://twitter.com/expeditionbge"
      label="Folge auf Twitter"
    />
    <SocialMediaButton
      icon="Youtube"
      link="https://www.youtube.com/channel/UCOxYY2kaKTBz2FSnk83qFDA"
      label="Folge auf Youtube"
    />
    <SocialMediaButton
      icon="Facebook"
      link="https://www.facebook.com/expedition.grundeinkommen"
      label="Folge auf Facebook"
    />
  </div>
);

export const FollowHamburg = ({ className }: { className: string }) => (
  <div className={className + ' flex justify-center'}>
    <SocialMediaButton
      icon="FacebookHamburg"
      link="https://www.facebook.com/expedition.grundeinkommen"
      label="Folge auf Facebook"
    />
    <SocialMediaButton
      icon="InstagramHamburg"
      link="https://www.instagram.com/hamburg.testet.grundeinkommen/"
      label="Folge auf Instagram"
    />
    <SocialMediaButton
      icon="TwitterHamburg"
      link="https://twitter.com/expeditionbge"
      label="Folge auf Twitter"
    />
  </div>
);
