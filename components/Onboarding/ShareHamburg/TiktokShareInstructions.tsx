import { CTAButton } from '../../Forms/CTAButton';
import s from './style.module.scss';

export const TiktokShareInstructions = () => {
  return (
    <div className={s.instagramShareInstructions}>
      <h2>Teile die Kampagne auf Tiktok!</h2>
      <p>
        Like Videos und reposte sie - so bringen wir das Thema gemeinsam in noch
        mehr Feeds! 💪❤️ Danke! #hamburgtestetgrundeinkommen
      </p>

      <CTAButton
        onClick={() =>
          window.open(
            'https://www.tiktok.com/@hhtestetgrundeinkommen',
            '_blank'
          )
        }
        className={s.tiktokModalButton}
      >
        Hier geht es zu Tiktok
      </CTAButton>
    </div>
  );
};

export default TiktokShareInstructions;
