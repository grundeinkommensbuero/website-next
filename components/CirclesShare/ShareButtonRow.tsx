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
    const username = userData?.store?.circlesResumee?.username;

    if (username) {
      return `${baseUrl}?username=${username}`;
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

  const title = `Tada! @CirclesUBI & @expeditionbge gönnen Grundeinkommen. Sobald mich 3 Menschen verifizieren, bekomm ich jeden Monat Circles im Wert von 72 €. Bitte verifiziert mich!\n\nWenn ihr noch keinen Circles-Account habt, könnt ihr euch dort einen anlegen.
`;
  const subject =
    'Bitte bestätige mich bei Circles – und probiere mit mir schon heute Grundeinkommen aus.';
  const body = mailBody(constructShareURL());
  const quote = `Oh là là! Circles & Expedition Grundeinkommen gönnen uns ein kleines Grundeinkommen. Ich hab mich gerade angemeldet. 
  
Sobald mich 3 Menschen verifizieren, bekomme ich jeden Monat ein Grundeinkommen in der Kryptowährung Circles im Wert von 72 € – ein Leben lang.

Wenn du schon einen Account bei Circles hast - könntest du meinen Account dann bitte verifizieren? Dann fängt mein Grundeinkommen an zu fließen :) Bitte verifiziere meinen Account, dann fängt mein Grundeinkommen an zu fließen. 

Wenn du noch keinen Account hast, kannst du dir natürlich auch einen für dich anlegen. Beides geht auf ${constructShareURL()}`;
  const messengerText = `Hi!\n\nIch hab mir gerade einen Account bei Circles geholt. Das ist eine neue Grundeinkommens-Kryptowährung.\n\nSobald mich 3 Menschen verifizieren, bekomme ich jeden Monat 720 Circles – ein Leben lang. Das entspricht heute einem Wert von 72 € pro Monat.\n\nWenn du schon einen Account bei Circles hast - könntest du meinen Account dann bitte verifizieren? Dann fängt mein Grundeinkommen an zu fließen :)\n\nWenn du noch keinen Account hast, kannst du dir natürlich auch einen für dich anlegen.\n\nDanke dir herzlich!\n`;

  return (
    <>
      <section className={s.shareButtonRow}>
        <TwitterShareButton
          title={title}
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
          title={`${messengerText}${constructShareURL()}`}
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
          title={messengerText}
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
