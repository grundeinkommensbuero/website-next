import { SmallSignup } from '../Forms/SmallSignup';

type SmallSignupDynamicProps = {
  ags?: string;
  flag?: string;
};

const SmallSignupDynamic = ({ ags, flag }: SmallSignupDynamicProps) => {
  return <SmallSignup ags={ags} flag={flag} />;
};

export default SmallSignupDynamic;
