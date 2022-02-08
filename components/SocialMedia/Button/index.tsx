import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';

export interface IIndexable {
  [key: string]: any;
}

const icons: IIndexable = {
  Facebook: require('!svg-inline-loader!./icons/facebook-brands.svg'),
  FacebookSquare: require('!svg-inline-loader!./icons/facebook-square-brands.svg'),
  Instagram: require('!svg-inline-loader!./icons/instagram-brands.svg'),
  Twitter: require('!svg-inline-loader!./icons/twitter-brands.svg'),
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
    target='_blank'
    rel='noreferrer'
    href={link}
    aria-label={label}
    className={cN(s.button, className, s['button' + iconSize])}
    dangerouslySetInnerHTML={{ __html: icons[icon] }}
  />
);
