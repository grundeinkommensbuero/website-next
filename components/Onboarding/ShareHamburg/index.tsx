import { RefObject, useState } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import s from './style.module.scss';

export const SharingFeatureHamburg = () => {
  const shareUrl = 'https://hamburg-testet-grundeinkommen.de/';
  const shareMessage = `Hast du das schon gehört? In Hamburg kommt es zum ersten Volksentscheid in Deutschland über ein bedingungsloses Grundeinkommen – am 12. Oktober.

Du kannst mithelfen, dass er erfolgreich ist:
📬 Hol dir den Newsletter, der dich an deine Wahlunterlagen erinnert und dir Ideen schickt, wie du beitragen kannst.
📣 Erzähl es weiter – deiner Familie, deinem Freundeskreis und bei der Arbeit.
${shareUrl}

Es geht um mehr Gerechtigkeit, mehr Vertrauen und Chancen für alle. Die Forschung zeigt: Grundeinkommen wirkt. Jetzt können wir zeigen, wie – mit dem ersten staatlichen Modellversuch, über den Hamburg per Briefwahl entscheidet.

Ich bin dabei. Machst du auch mit?`;

  return (
    <section>
      <div className={s.parent}>
        <FacebookShareButton
          url={shareUrl}
          quote={shareMessage}
          className={s.facebook}
        >
          <FacebookIcon className={s.facebookIcon} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={shareMessage}
          className={s.twitter}
        >
          <TwitterIcon className={s.twitterIcon} round />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={shareMessage}
          className={s.whatsapp}
        >
          <WhatsappIcon className={s.whatsappIcon} round />
        </WhatsappShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={shareMessage}
          className={s.telegram}
        >
          <TelegramIcon className={s.telegramIcon} round />
        </TelegramShareButton>

        <EmailShareButton
          url={shareUrl}
          subject="Grundeinkommen – Volksentscheid in Hamburg"
          body={shareMessage}
          className={s.email}
          title="Email"
        >
          <EmailIcon className={s.emailIcon} round />
        </EmailShareButton>

        <div className={s.instagram}>
          <div className={s.iconWrapper} title="Instagram">
            <img
              src="/icons/Instagram.svg"
              alt="Instagram"
              className={s.iconImage}
            />
          </div>
        </div>

        <div className={s.tiktok}>
          <div className={s.iconWrapper} title="TikTok">
            <img src="/icons/tiktok.svg" alt="TikTok" className={s.iconImage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SharingFeatureHamburg;
