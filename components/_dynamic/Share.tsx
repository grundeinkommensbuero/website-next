import { useContext, useEffect, useRef, useState } from 'react';
import AuthContext, { MunicipalityOfUser } from '../../context/Authentication';
import SharingFeature from '../Onboarding/Share';

// TODO: maybe refactor and move some of the logic into the feature to
// keep dynamic component leaner
const ShareDynamic = () => {
  const { customUserData, userId } = useContext(AuthContext);
  const [municipalityToShare, setMunicipalityToShare] =
    useState<MunicipalityOfUser>();
  const scrollToRef = useRef(null);

  useEffect(() => {
    if (customUserData?.municipalities) {
      setMunicipalityToShare(
        getMostRecentMunicipality(customUserData.municipalities)
      );
    }
  }, [customUserData]);

  return (
    <>
      <div ref={scrollToRef}></div>
      <SharingFeature
        userData={customUserData}
        userId={userId}
        municipality={municipalityToShare}
        isInOnboarding={false}
        scrollToRef={scrollToRef}
        previewComponent={
          <>
            <p className="pt-6">
              Je mehr Menschen sich für die Expedition anmelden, um so besser
              stehen die Chancen, dass dein Wohnort und viele andere Orte bald
              Grundeinkommen erforschen und am Modellversuch teilnehmen. Teile
              dafür deine Begeisterung über deine Social-Media-Kanäle!
            </p>
            <p>
              {' '}
              Wir haben dir eine persönliche Grafik (Sharepic) zum Teilen
              vorbereitet. Wenn du auf den Knopf mit deinem bevorzugten Kanal
              klickst, siehst du deinen persönliche Vorschau.
            </p>
          </>
        }
        introText={'Hole mehr Menschen dazu!'}
      />
    </>
  );
};

const getMostRecentMunicipality = (municipalities: MunicipalityOfUser[]) => {
  return municipalities.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
};

export default ShareDynamic;
