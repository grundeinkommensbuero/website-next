import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share';
import s from './style.module.scss';
import React from 'react';
import { Modal } from '../../Modal';
import InstagramShareInstructions from './InstagramShareInstructions';

export const SocialMediaShareButtons = ({
  shareMessage,
  shareMessageShort,
  shareUrl,
}: {
  shareMessage: string;
  shareMessageShort: string;
  shareUrl: string;
}) => {
  const [showInstagramModal, setShowInstagramModal] = React.useState(false);
  return (
    <section>
      <Modal
        showModal={showInstagramModal}
        setShowModal={setShowInstagramModal}
        colorScheme={'colorSchemeHamburgYellow'}
      >
        <InstagramShareInstructions />
      </Modal>
      <div className={s.socialMediaButtonsContainer}>
        <div className={s.buttonWithLabel}>
          <WhatsappShareButton
            url={' '}
            title={shareMessage}
            className={s.whatsapp}
          >
            <WhatsappIcon className={s.whatsappIcon} round />
          </WhatsappShareButton>
          <span className={s.label}>WhatsApp</span>
        </div>

        <div className={s.buttonWithLabel}>
          <TelegramShareButton
            url={' '}
            title={shareMessage}
            className={s.telegram}
          >
            <TelegramIcon className={s.telegramIcon} round />
          </TelegramShareButton>
          <span className={s.label}>Telegram</span>
        </div>

        <div className={s.buttonWithLabel}>
          <EmailShareButton
            url={' '}
            subject="Grundeinkommen – Volksentscheid in Hamburg"
            body={shareMessage}
            className={s.email}
          >
            <EmailIcon className={s.emailIcon} round />
          </EmailShareButton>
          <span className={s.label}>Email</span>
        </div>

        <div className={s.buttonWithLabel}>
          <div
            className={s.instagram}
            onClick={() => setShowInstagramModal(true)}
          >
            <div className={s.iconWrapper} title="Instagram">
              <img
                src="/icons/Instagram.svg"
                alt="Instagram"
                className={s.iconImage}
              />
            </div>
          </div>
          <span className={s.label}>Instagram</span>
        </div>

        <div className={s.buttonWithLabel}>
          <FacebookShareButton
            url={shareUrl}
            // quote={shareMessage}
            className={s.facebook}
          >
            <FacebookIcon className={s.facebookIcon} round />
          </FacebookShareButton>
          <span className={s.label}>Facebook</span>
        </div>

        <div className={s.buttonWithLabel}>
          <TwitterShareButton
            url={' '}
            title={shareMessageShort}
            className={s.twitter}
          >
            <XIcon className={s.twitterIcon} round />
          </TwitterShareButton>
          <span className={s.label}>X</span>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaShareButtons;
