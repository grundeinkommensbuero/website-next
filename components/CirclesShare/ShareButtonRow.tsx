import React from 'react';
import s from './style.module.scss';
import ShareButtons from './ShareButtons.json';
import cN from 'classnames';
import { Channel } from '.';

type ShareButtonRowProps = {
  setShareChannel: (shareChannel: Channel) => void;
  setSharePreviewActive: (active: boolean) => void;
};

export const ShareButtonRow = ({
  setShareChannel,
  setSharePreviewActive,
}: ShareButtonRowProps) => {
  const iconInstagram = require('!svg-inline-loader!./icons/Instagram.svg');
  const iconTwitter = require('!svg-inline-loader!./icons/twitter.svg');
  const iconFacebook = require('!svg-inline-loader!./icons/facebook.svg');
  const iconTelegram = require('!svg-inline-loader!./icons/telegram.svg');
  const iconWhatsApp = require('!svg-inline-loader!./icons/whatsapp.svg');
  const iconMail = require('!svg-inline-loader!./icons/mail.svg');

  const activatePreview = (channel: string) => {
    const i = ShareButtons.findIndex(el => el.channelIdentifier === channel);
    // console.log(ShareButtons[i]);
    setShareChannel(ShareButtons[i]);
    setSharePreviewActive(true);
  };

  return (
    <>
      <section className={s.shareButtonRow}>
        <button
          className={s.shareItem}
          onClick={() => activatePreview('twitter')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconTwitter }}
            ></div>
            <span>Twitter</span>
          </div>
        </button>

        <button
          className={s.shareItem}
          onClick={() => activatePreview('facebook')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconFacebook }}
            ></div>
            <span>Facebook</span>
          </div>
        </button>

        <button
          className={s.shareItem}
          onClick={() => activatePreview('instagram')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon, s.iconInstagram)}
              dangerouslySetInnerHTML={{ __html: iconInstagram }}
            ></div>
            <span>Instagram</span>
          </div>
        </button>

        <button
          className={s.shareItem}
          onClick={() => activatePreview('telegram')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconTelegram }}
            ></div>
            <span>Telegram</span>
          </div>
        </button>

        <button
          className={s.shareItem}
          onClick={() => activatePreview('whatsapp')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconWhatsApp }}
            ></div>
            <span>WhatsApp</span>
          </div>
        </button>

        <button
          className={s.shareItem}
          onClick={() => activatePreview('email')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon, s.iconMail)}
              dangerouslySetInnerHTML={{ __html: iconMail }}
            ></div>
            <span>E-Mail</span>
          </div>
        </button>
      </section>
    </>
  );
};
