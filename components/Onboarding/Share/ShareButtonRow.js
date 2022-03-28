import React from 'react';
import * as s from './style.module.less';
import ShareButtons from './ShareButtons.json';
import cN from 'classnames';

export const ShareButtonRow = ({
  setShareChannel,
  setSharePreviewActive,
  isInOnboarding,
  executeScroll,
}) => {
  const iconInstagram = require('!svg-inline-loader!./icons/Instagram.svg');
  const iconTwitter = require('!svg-inline-loader!./icons/twitter.svg');
  const iconFacebook = require('!svg-inline-loader!./icons/facebook.svg');
  const iconTelegram = require('!svg-inline-loader!./icons/telegram.svg');
  const iconWhatsApp = require('!svg-inline-loader!./icons/whatsapp.svg');
  const iconMail = require('!svg-inline-loader!./icons/mail.svg');

  const activatePreview = channel => {
    const i = ShareButtons.findIndex(el => el.channelIdentifier === channel);
    // console.log(ShareButtons[i]);
    setShareChannel(ShareButtons[i]);
    setSharePreviewActive(true);
    executeScroll();
  };

  return (
    <>
      <section
        className={cN(
          { [s.shareButtonRow]: isInOnboarding },
          { [s.municipalityShare]: !isInOnboarding }
        )}
      >
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
            <p>Twitter</p>
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
            <p>Facebook</p>
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
            <p>Instagram</p>
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
            <p>Telegram</p>
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
            <p>WhatsApp</p>
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
            <p>E-Mail</p>
          </div>
        </button>
      </section>
    </>
  );
};
