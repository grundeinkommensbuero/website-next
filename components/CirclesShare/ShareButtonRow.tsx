import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { mailBody } from './mailBody';
import { User } from '../../context/Authentication';
import { useUpdateUser } from '../../hooks/Api/Users/Update';

type ShareButtonRowProps = {
  userData: User;
  userId: string;
};

export const ShareButtonRow = ({ userData, userId }: ShareButtonRowProps) => {
  const [, updateUser] = useUpdateUser();

  // const iconInstagram = require('!svg-inline-loader!./icons/Instagram.svg');
  const iconTwitter = require('!svg-inline-loader!./icons/twitter.svg');
  const iconFacebook = require('!svg-inline-loader!./icons/facebook.svg');
  const iconTelegram = require('!svg-inline-loader!./icons/telegram.svg');
  const iconWhatsApp = require('!svg-inline-loader!./icons/whatsapp.svg');
  const iconMail = require('!svg-inline-loader!./icons/mail.svg');

  const constructShareURL = () => {
    const baseUrl = 'https://volksentscheid-grundeinkommen.de/meine-circles';
    const safeAddress = userData?.store?.circlesResumee?.safeAddress;
    const username = userData?.store?.circlesResumee?.username;

    if (safeAddress) {
      return `${baseUrl}?safeAddress=${safeAddress}${
        username ? `&${username}` : ''
      }`;
    } else {
      return baseUrl;
    }
  };

  const handleClick = (channel: string) => {
    // Only safe first share
    if (!userData?.store?.clickedCirclesShare) {
      updateUser({
        userId,
        store: {
          clickedCirclesShare: {
            timestamp: new Date().toISOString(),
            channel,
          },
        },
      });
    }
  };

  const title = `Bring das Grundeinkommen mit mir an den Staat! Melde dich dafür bei der Expedition Grundeinkommen an. Ich bin schon dabei :)`;
  const hashtags = [
    'ModellversuchJetzt',
    'Grundeinkommen',
    'ExpeditionGrundeinkommen',
  ];
  const subject = `Gemeinsam bringen wir das Grundeinkommen nach Hause`;
  const body = mailBody();
  const quote = `Bring das Grundeinkommen mit mir an den Staat! Melde dich dafür bei der Expedition Grundeinkommen an. Ich bin schon  dabei :)`;

  return (
    <>
      <section className={s.shareButtonRow}>
        <TwitterShareButton
          title={title}
          hashtags={hashtags}
          url={constructShareURL()}
          windowWidth={1200}
          windowHeight={1000}
          className={s.shareItem}
          beforeOnClick={() => handleClick('twitter')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconTwitter }}
            ></div>
            <span>Twitter</span>
          </div>
        </TwitterShareButton>

        <FacebookShareButton
          title={title}
          quote={quote}
          url={constructShareURL()}
          windowWidth={1200}
          windowHeight={1000}
          className={s.shareItem}
          beforeOnClick={() => handleClick('facebook')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconFacebook }}
            ></div>
            <span>Facebook</span>
          </div>
        </FacebookShareButton>

        <TelegramShareButton
          title={title}
          url={constructShareURL()}
          windowWidth={1200}
          windowHeight={1000}
          className={s.shareItem}
          beforeOnClick={() => handleClick('telegram')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconTelegram }}
            ></div>
            <span>Telegram</span>
          </div>
        </TelegramShareButton>

        <WhatsappShareButton
          title={title}
          url={constructShareURL()}
          windowWidth={1200}
          windowHeight={1000}
          className={s.shareItem}
          beforeOnClick={() => handleClick('whatsapp')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon)}
              dangerouslySetInnerHTML={{ __html: iconWhatsApp }}
            ></div>
            <span>WhatsApp</span>
          </div>
        </WhatsappShareButton>

        <EmailShareButton
          title={title}
          subject={subject}
          body={body}
          url={constructShareURL()}
          windowWidth={1200}
          windowHeight={1000}
          className={s.shareItem}
          beforeOnClick={() => handleClick('email')}
        >
          <div className={s.shareButtonContainer}>
            <div
              aria-hidden="true"
              className={cN(s.shareIcon, s.iconMail)}
              dangerouslySetInnerHTML={{ __html: iconMail }}
            ></div>
            <span>E-Mail</span>
          </div>
        </EmailShareButton>
      </section>
    </>
  );
};
