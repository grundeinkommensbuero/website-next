import React, { useContext } from 'react';

import s from './style.module.scss';
import AvatarImage from '../../../components/AvatarImage';
import AuthContext from '../../../context/Authentication';
import { CTALink, CTALinkExternal } from '../../../components/Forms/CTAButton';
import { SectionWrapper } from '../../../components/Section/SectionWrapper';

const CollectorNextStepsPage = () => {
  const { customUserData } = useContext(AuthContext);

  return (
    <SectionWrapper colorScheme="colorSchemeWhite">
      <div className={s.container}>
        <div className={s.avatarContainer}>
          <AvatarImage user={customUserData} className={s.avatar} />
        </div>

        <div className={s.content}>
          <p>
            Hallo {customUserData?.username}! <br />
            Danke, dass du mitsammelst. Wir melden uns bei dir, wenn wir eine
            Aktion planen. Bitte hilf uns, indem du selbst aktiv wirst, dich mit
            anderen vernetzt und Sammelevents planst! Wenn du mitsammeln oder
            selbst ein Event planen willst, kannst du das über einen dieser
            Wege:
          </p>

          <h3 className={'my-4'}>Über die Website</h3>
          <CTALink to="/berlin/termine#karte">Zur Sammelkarte</CTALink>

          <h3 className={'my-4'}>Über die Sammelapp</h3>
          <CTALinkExternal href="https://play.google.com/store/apps/details?id=berlin.sammelapp">
            Zur Android App
          </CTALinkExternal>
          <br />
          <br />
          <CTALinkExternal href="https://apps.apple.com/us/app/berliner-sammel-app/id1619980654">
            Zur iOS App
          </CTALinkExternal>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CollectorNextStepsPage;
