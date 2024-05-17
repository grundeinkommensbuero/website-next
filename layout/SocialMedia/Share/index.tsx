import React, { ReactElement } from 'react';
import s from './style.module.scss';
import { SocialMediaButton } from '../Button';

type ShareProps = {
  children: ReactElement;
  className: string;
};

export const Share = ({ children, className }: ShareProps) => {
  const iconSize = 'XL';

  const facebookText =
    'Hey+Leute%21%0D%0AIch+unterst%C3%BCtze+die+neue+Initiative+%22Expedition+Grundeinkommen%E2%80%9D.%0D%0ADie+Idee%3A+Grundeinkommen+in+unterschiedlichen+Varianten+austesten%2C+um+die+Herausforderungen+und+M%C3%B6glichkeiten+besser+zu+verstehen+und+klar+benennen+zu+k%C3%B6nnen.+Das+Ganze+wird+wissenschaftlich+begleitet+und+dokumentiert%2C+damit+anschlie%C3%9Fend+eine+gemeinsame+und+faire+Debatte+zwischen+Zivilgesellschaft+und+Politik+m%C3%B6glich+ist.%0D%0AHier+geht%E2%80%99s+zur+Website%3A';
  const twitterText =
    'Hey+Leute%21+Ich+unterst%C3%BCtze+die+neue+Initiative+%40expeditionbge+%21+Die+Idee%3A+%23grundeinkommen+ausprobieren%2C+besser+verstehen+%26+gemeinsam+eine+faire+Debatte+f%C3%BChren.%0D%0AAlle+Infos+%26+Updates%3A%0D%0Ahttps%3A%2F%2Fexpedition-grundeinkommen.de%2F%0D%0Ahttps%3A%2F%2Fwww.facebook.com%2Fexpeditionbge%2F%0D%0Ahttps%3A%2F%2Fwww.instagram.com%2Fhamburg.testet.grundeinkommen%2F%0D%0A%28sharing+is+caring+%F0%9F%98%8A%29';

  return (
    <div className={className}>
      {children && <p>{children}</p>}
      <div className={s.iconContainer}>
        <SocialMediaButton
          icon="Facebook"
          link={`https://www.facebook.com/share.php?u=https://expedition-grundeinkommen.de&quote=${facebookText}`}
          iconSize={iconSize}
          label="Teile auf Facebook"
          className={s.shareButton}
        />
        <SocialMediaButton
          icon="Twitter"
          link={`https://www.twitter.com/intent/tweet?text=${twitterText}`}
          iconSize={iconSize}
          label="Teile auf Twitter"
          className={s.shareButton}
        />
      </div>
    </div>
  );
};
