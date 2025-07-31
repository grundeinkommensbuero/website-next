import SocialMediaShareButtons from '../Onboarding/ShareHamburg/SocialMediaShareButtons';
import {
  shareMessage,
  shareMessageShort,
  shareUrl,
} from '../Onboarding/ShareHamburg/shareMessage';

const SocialMediaShareButtonsDynamic = () => {
  return (
    <SocialMediaShareButtons
      shareMessage={shareMessage}
      shareMessageShort={shareMessageShort}
      shareUrl={shareUrl}
    />
  );
};

export default SocialMediaShareButtonsDynamic;
