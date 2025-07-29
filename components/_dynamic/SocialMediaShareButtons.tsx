import SocialMediaShareButtons from '../Onboarding/ShareHamburg/SocialMediaShareButtons';
import {
  shareMessage,
  shareUrl,
} from '../Onboarding/ShareHamburg/shareMessage';

const SocialMediaShareButtonsDynamic = () => {
  return (
    <SocialMediaShareButtons shareMessage={shareMessage} shareUrl={shareUrl} />
  );
};

export default SocialMediaShareButtonsDynamic;
