import CopyShareMessageBox from '../Onboarding/ShareHamburg/CopyShareMessageBox';
import { shareMessage } from '../Onboarding/ShareHamburg/shareMessage';

const CopyShareMessageBoxDynamic = () => {
  return <CopyShareMessageBox shareMessage={shareMessage} />;
};

export default CopyShareMessageBoxDynamic;
