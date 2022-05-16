import React, { useState, useContext, useEffect, ReactElement } from 'react';

import AuthContext from '../../context/Authentication';
import { MunicipalityContext } from '../../context/Municipality';
import { useUpdateUser } from '../../hooks/Api/Users/Update';
import { OnboardingModalContext } from '../../context/OnboardingModal';

import s from './style.module.scss';
import menuElements from './BreadcrumbMenu.json';

import { BreadcrumbLinks } from './BreadcrumbLinks';
import { SignUpFlow } from './SignUpFlow';
// import { Engage } from './Engage';
// import { EngagementLevel } from './EngagementLevel';
// import { QuestionUBI } from './QuestionUBI';
import { SharingFeature } from './Share';
import { Donate } from './Donate';
import { SetupProfile } from './SetupProfile';
import { FinalNote } from './FinalNote';
import { hasKey } from '../../utils/hasKey';

export const Onboarding = () => {
  const {
    isAuthenticated,
    userId,
    customUserData: userData,
    updateCustomUserData,
  } = useContext(AuthContext);
  const { municipality } = useContext(MunicipalityContext);
  const [engagementOption, setEngagementOption] = useState();
  const [currentElement, setCurrentElement] = useState(menuElements[0].name);
  const [isForMunicipalityAuthenticated, setIsForMunicipalityAuthenticated] =
    useState(false);
  const { setShowModal } = useContext(OnboardingModalContext);
  const [, updateUser] = useUpdateUser();

  // Fetch new user data in the beginning
  useEffect(() => {
    if (isAuthenticated) {
      updateCustomUserData && updateCustomUserData();
    }
    console.log('Fetch initial userData');
  }, [isAuthenticated]);

  // TODO: use state of updateUser for improvement (Vali: comment still relevant? I removed some stuff)
  // TODO: Reactive, once municipality pages are ready
  // useEffect(() => {
  //   if (municipality) {
  //     if (
  //       userData?.municipalities?.map(el => el.ags).includes(municipality.ags)
  //     ) {
  //       setIsForMunicipalityAuthenticated(true);
  //     }
  //   }
  // }, [userData, municipality]);

  // TODO: delete once municipality pages are ready
  useEffect(() => {
    if (isAuthenticated) {
      setIsForMunicipalityAuthenticated(true);
    }
  }, [isAuthenticated]);

  const setCurrentElementByIndex = (index: number) => {
    setCurrentElement(menuElements[index].name);
  };

  const CurrentComponent = (): ReactElement => {
    console.log(currentElement);

    switch (currentElement) {
      case 'SetupProfile':
        return (
          <SetupProfile
            userData={userData}
            userId={userId}
            compIndex={menuElements.findIndex(el => el.name === currentElement)}
            setCurrentElementByIndex={setCurrentElementByIndex}
          />
        );
      case 'Donate':
        return (
          <Donate
            userData={userData}
            userId={userId}
            compIndex={menuElements.findIndex(el => el.name === currentElement)}
            setCurrentElementByIndex={setCurrentElementByIndex}
            updateUser={updateUser}
            updateCustomUserData={updateCustomUserData}
            municipality={municipality}
          />
        );
      case 'SharingFeature':
        return (
          <SharingFeature
            userData={userData}
            userId={userId}
            compIndex={menuElements.findIndex(el => el.name === currentElement)}
            setCurrentElementByIndex={setCurrentElementByIndex}
            municipality={municipality}
          />
        );
      case 'FinalNote':
        return (
          <FinalNote municipality={municipality} setShowModal={setShowModal} />
        );
      default:
        return <h2>Oops! Seite nicht gefunden!</h2>;
    }
  };

  return (
    <>
      {!isForMunicipalityAuthenticated ? (
        <div className={s.onboardingContent}>
          <SignUpFlow />
        </div>
      ) : (
        <>
          {/* Show onboarding content */}
          <nav className={s.breadcrumbContainer}>
            <BreadcrumbLinks
              setCurrentElement={setCurrentElement}
              currentElement={currentElement}
            />
          </nav>
          <div className={s.onboardingContent}>
            <CurrentComponent />
          </div>
        </>
      )}
    </>
  );
};

// Default export needed for lazy loading
export default Onboarding;
