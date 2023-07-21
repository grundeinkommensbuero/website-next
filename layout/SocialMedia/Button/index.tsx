import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';

const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

export interface IIndexable {
  [key: string]: any;
}

const icons: IIndexable = {
  Facebook: require('!svg-inline-loader!./icons/facebook-brands.svg'),
  FacebookHamburg: require('!svg-inline-loader!./icons/facebook-hamburg.svg'),
  FacebookSquare: require('!svg-inline-loader!./icons/facebook-square-brands.svg'),
  Instagram: require('!svg-inline-loader!./icons/instagram-brands.svg'),
  InstagramHamburg: require('!svg-inline-loader!./icons/instagram-hamburg.svg'),
  Twitter: require('!svg-inline-loader!./icons/twitter-brands.svg'),
  TwitterHamburg: require('!svg-inline-loader!./icons/twitter-hamburg.svg'),
  WhatsApp: require('!svg-inline-loader!./icons/whatsapp-brands.svg'),
  WhatsAppSquare: require('!svg-inline-loader!./icons/whatsapp-square-brands.svg'),
  Telegram: require('!svg-inline-loader!./icons/telegram-plane-brands.svg'),
  TelegramRound: require('!svg-inline-loader!./icons/telegram-brands.svg'),
  Youtube: require('!svg-inline-loader!./icons/youtube.svg'),
};

type SocialButtonProps = {
  link: string;
  label: string;
  className?: string;
  icon: string;
  iconSize?: string;
};

export const SocialMediaButton = ({
  link,
  label,
  className,
  icon,
  iconSize,
}: SocialButtonProps) => (
  <a
    target="_blank"
    rel="noreferrer"
    href={link}
    aria-label={label}
    className={cN(
      s.button,
      className,
      { [s.hamburg]: IS_HAMBURG_PROJECT },
      s['button' + iconSize]
    )}
    dangerouslySetInnerHTML={{ __html: icons[icon] }}
  />
);
