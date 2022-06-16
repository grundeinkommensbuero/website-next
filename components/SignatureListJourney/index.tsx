import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AuthContext, { ListFlow } from '../../context/Authentication';
import { InlineButton, InlineLinkButton } from '../Forms/Button';
import s from './style.module.scss';
import DownloadIcon from './download.svg';
import PrintIcon from './print.svg';
import SignIcon from './sign.svg';
import ShareIcon from './share.svg';
import SendIcon from './send.svg';

import PrintIconDisabled from './print-disabled.svg';
import SignIconDisabled from './sign-disabled.svg';
import ShareIconDisabled from './share-disabled.svg';
import SendIconDisabled from './send-disabled.svg';

import cN from 'classnames';
import { useUpdateUser } from '../../hooks/Api/Users/Update';
import querystring from 'query-string';
import { Modal } from '../Modal';
import { useRouter } from 'next/router';
import { LoadingAnimation } from '../LoadingAnimation';
import { CTAButton, CTAButtonContainer } from '../Forms/CTAButton';
import { HurrayCrowd } from '../HurrayCrowd';
import Link from 'next/link';
import toast from 'react-hot-toast';

type UrlParams = {
  step?: string;
  success?: boolean;
};

export const SignatureListJourney = ({
  pdfUrl,
}: {
  pdfUrl?: string | string[];
}) => {
  const { customUserData, isAuthenticated, updateCustomUserData } =
    useContext(AuthContext);
  const [urlParams, setUrlParams] = useState<UrlParams>();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { listFlow } = customUserData;

  // Process url params to update user automatically
  useEffect(() => {
    const { step, success } = querystring.parse(window.location.search);

    const params: UrlParams = {};

    if (step) {
      params.step = step as string;
    }

    if (success) {
      params.success = success === 'true' ? true : false;

      // Show snackbar message if user responded with no success
      if (success === 'false') {
        toast.success('Super, vielen Dank für dein Feedback!', {
          duration: 5000,
          position: 'bottom-right',
        });
      }
    }

    setUrlParams(params);
  }, []);

  // If signed out navigate to login
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login/?nextPage=unterschreiben-schritte');
    }
  }, [isAuthenticated]);

  // We want the loading animation to wait until the user data is fetched
  // Otherwise the ui would show state in the beginning --> not so smooth
  if (
    typeof isAuthenticated === 'undefined' ||
    // Since the move to next we need to check for a specific attribute
    // to be there in customUserData, because it is not initialized as empty
    // object anymore
    !customUserData?.email
  ) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div className={s.container}>
        <Step
          icon={DownloadIcon}
          iconAlt="Illustration einer E-Mail"
          headline="Schau in dein Postfach!"
          ctaText="Ich habe die Liste bekommen!"
          attributeToSet="downloadedList"
          secondaryCtaText="Hilfe, die Liste kommt nicht an!"
          onSecondaryCtaClick={() => {
            window.open(
              'mailto:support@expedition-grundeinkommen.de?subject=Ich%20habe%20keine%20Liste%20bekommen'
            );
          }}
          done={!!listFlow?.downloadedList?.value}
          updateUserData={updateCustomUserData}
          urlParams={urlParams}
          step={1}
        >
          <>
            Wir haben dir eine Unterschriftenliste per Email geschickt. Falls du
            sie direkt downloaden willst, findest du sie auch{' '}
            <InlineLinkButton
              target="_blank"
              href={pdfUrl || '/unterschreiben'}
            >
              HIER
            </InlineLinkButton>
            .
          </>
        </Step>

        <Step
          icon={PrintIcon}
          iconDisabled={PrintIconDisabled}
          iconAlt="Illustration eines Druckers"
          headline="Druck die Liste aus!"
          ctaText="Ich habe die Liste gedruckt!"
          attributeToSet="printedList"
          secondaryCtaText="Listen per Post bestellen"
          onSecondaryCtaClick={() => {
            window.open(
              'https://innn.it/Volksentscheid-Grundeinkommen',
              '_blank'
            );
          }}
          done={!!listFlow?.printedList?.value}
          disabled={!hasReachedStep(listFlow, 'printedList')}
          updateUserData={updateCustomUserData}
          urlParams={urlParams}
          step={2}
        >
          <>
            Unterschriften für Volksbegehren müssen handschriftlich auf Papier
            erfolgen. Wirf am besten gleich deinen Drucker an und druck die
            Liste aus.
            <br />
            <br />
            <h3>Du hast keinen Drucker?</h3>
            Dann komm doch bei einem unserer{' '}
            <Link href="/termine#karte">Soli-Orte</Link> vorbei – oder lass dir
            die Liste{' '}
            <InlineLinkButton
              to="https://innn.it/Volksentscheid-Grundeinkommen"
              target="_blank"
            >
              von unserem Partner innn.it per Post schicken
            </InlineLinkButton>
            .
          </>
        </Step>

        <Step
          icon={SignIcon}
          iconDisabled={SignIconDisabled}
          iconAlt="Illustration des Unterschreibens"
          headline="Unterschreibe direkt..."
          ctaText="Ich habe unterschrieben!"
          attributeToSet="signedList"
          done={!!listFlow?.signedList?.value}
          disabled={!hasReachedStep(listFlow, 'signedList')}
          updateUserData={updateCustomUserData}
          urlParams={urlParams}
          step={3}
        >
          ...auf der ausgedruckten Liste.
        </Step>

        <Step
          icon={ShareIcon}
          iconDisabled={ShareIconDisabled}
          iconAlt="Illustration von Freund:innen"
          headline="...und frag gleich noch ein paar Bekannte!"
          ctaText="Hab ich gemacht!"
          attributeToSet="sharedList"
          secondaryCtaText="Ich frage sie später!"
          secondaryCtaAddProperty={{ willDoLater: true }}
          done={!!listFlow?.sharedList?.value}
          disabled={!hasReachedStep(listFlow, 'sharedList')}
          updateUserData={updateCustomUserData}
          urlParams={urlParams}
          step={4}
        >
          Hast du Mitbewohner*innen, Freund*innen oder Kolleg*innen in der Nähe?
          Lass sie gleich mitunterschreiben!
        </Step>

        <Step
          icon={SendIcon}
          iconDisabled={SendIconDisabled}
          iconAlt="Illustration von Freund:innen"
          headline="Schick den Brief auf die Reise!"
          ctaText="Ich habe den Brief abgeschickt!"
          attributeToSet="sentList"
          done={!!listFlow?.sentList?.value}
          onDone={() => setShowModal(true)}
          disabled={!hasReachedStep(listFlow, 'sentList')}
          updateUserData={updateCustomUserData}
          urlParams={urlParams}
          step={5}
        >
          <>
            Lauf gleich los zum nächsten Briefkasten und wirf den Brief ein.
            Gute Reise!
            <br />
            <br />
            <h3>Keine Briefmarke zur Hand?</h3>
            Wusstest du, dass die Post mittlerweile eine Online-Frankierung
            anbietet? Das geht sogar ohne Drucker –{' '}
            <InlineLinkButton
              href="https://www.deutschepost.de/de/m/mobile-briefmarke.html"
              target="_blank"
            >
              schau doch mal hier vorbei.
            </InlineLinkButton>
          </>
        </Step>
      </div>

      <Modal showModal={showModal} setShowModal={setShowModal}>
        <>
          <div className={s.modal}>
            <h3>Hurra, geschafft!</h3>
            <p>
              Vielen Dank, dass du den Brief abgeschickt hast und der Initiative
              zum Erfolg verhilfst!{' '}
              <Link href="/me/unterschriften-eintragen">
                Trag hier deine Unterschriften ein
              </Link>{' '}
              und lass den Balken steigen.
            </p>

            <p>
              Möchtest du noch mehr tun? Dann schließ dich doch einem unserer
              Sammelevents an! Schau mal{' '}
              <Link href="/termine#karte">auf der Karte</Link> vorbei um zu
              sehen, wo Events in deiner Nähe stattfinden.
            </p>
          </div>
          <HurrayCrowd small={true} />
        </>
      </Modal>
    </>
  );
};

type StepProps = {
  icon: any;
  iconDisabled?: any;
  iconAlt: string;
  headline: string;
  ctaText: string;
  attributeToSet: string;
  secondaryCtaText?: string;
  secondaryCtaAddProperty?: object;
  onSecondaryCtaClick?: () => void;
  onDone?: () => void;
  done: boolean;
  disabled?: boolean;
  children: ReactElement | string;
  updateUserData: () => void;
  urlParams?: UrlParams;
  step: number;
};

const Step = ({
  icon,
  iconDisabled,
  iconAlt,
  headline,
  ctaText,
  attributeToSet,
  secondaryCtaText,
  // If this prop is set, the secondary cta is the same as primary cta,
  // but a flag is added
  secondaryCtaAddProperty,
  onSecondaryCtaClick,
  done,
  onDone,
  disabled,
  children,
  updateUserData,
  urlParams,
  step,
}: StepProps) => {
  const [updateUserState, updateUser] = useUpdateUser();
  const scrollToRef = useRef<HTMLDivElement>(null);
  const scrollToNextRef = useRef<HTMLDivElement>(null);

  const timestamp = new Date().toISOString();

  const setAttribute = (propertyToAdd = {}) => {
    updateUser({
      listFlow: {
        [attributeToSet]: { value: true, timestamp, ...propertyToAdd },
      },
    });
  };

  // Process url params to update user automatically
  useEffect(() => {
    if (urlParams?.step === attributeToSet) {
      if (scrollToRef?.current) {
        scrollToRef.current.scrollIntoView({
          block: 'end',
        });
      }

      // If attribute is not set yet and the success param is passed
      //  we want to set it automatically
      if (!done && urlParams.success) {
        setTimeout(() => {
          setAttribute();
        }, 600);
      }
    }
  }, [urlParams, scrollToRef]);

  useEffect(() => {
    if (updateUserState === 'updated') {
      updateUserData();

      if (scrollToNextRef.current && attributeToSet !== 'sentList') {
        // Scroll to next step after success animation is done
        setTimeout(() => {
          if (scrollToNextRef?.current) {
            scrollToNextRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 1000);
      }

      if (onDone) {
        // Wait for success animation to finish
        setTimeout(() => {
          onDone();
        }, 1000);
      }
    }
  }, [updateUserState]);

  const Icon = disabled ? iconDisabled : icon;

  console.log({ updateUserState, done });
  return (
    <>
      <div className={cN(s.stepContainer, { [s.disabled]: disabled })}>
        <div className={s.breadcrumbs}>
          <div className={cN({ [s.filled]: step >= 1 })}></div>
          <div className={cN({ [s.filled]: step >= 2 })}></div>
          <div className={cN({ [s.filled]: step >= 3 })}></div>
          <div className={cN({ [s.filled]: step >= 4 })}></div>
          <div className={cN({ [s.filled]: step >= 5 })}></div>
        </div>

        <Icon alt={iconAlt} className={s.icon} />

        <h2>{headline}</h2>
        <p>{children}</p>

        <CTAButtonContainer className={s.ctaContainer}>
          <CTAButton
            onClick={() => setAttribute()}
            disabled={disabled}
            // If the step is already done we directly render the the success icon
            success={done || updateUserState === 'updated'}
            loading={updateUserState === 'loading'}
          >
            {ctaText}
          </CTAButton>
        </CTAButtonContainer>

        {secondaryCtaText && !updateUserState && !done && (
          <div className={s.secondaryCta}>
            <InlineButton
              onClick={() => {
                if (secondaryCtaAddProperty) {
                  setAttribute(secondaryCtaAddProperty);
                } else if (onSecondaryCtaClick) {
                  onSecondaryCtaClick();
                }
              }}
            >
              {secondaryCtaText}
            </InlineButton>
          </div>
        )}
      </div>

      {scrollToRef && <div className={s.scrollTo} ref={scrollToRef}></div>}

      {scrollToNextRef && (
        <div className={s.scrollToNext} ref={scrollToNextRef}></div>
      )}
    </>
  );
};

// This function should evaluate, if user has done the step (maybe change it in the future,
// if user should do all steps) before this one
// so that the new step is not disabled anymore
const hasReachedStep = (listFlow: ListFlow | undefined, step: string) => {
  if (step === 'printedList') {
    // We also need to check if this step or a futre step is already done, otherwise it would still be disabled
    // if the step before is not done.
    return (
      listFlow?.downloadedList?.value ||
      listFlow?.printedList?.value ||
      listFlow?.signedList?.value ||
      listFlow?.sharedList?.value ||
      listFlow?.sentList?.value
    );
  }

  if (step === 'signedList') {
    return (
      listFlow?.printedList?.value ||
      listFlow?.signedList?.value ||
      listFlow?.sharedList?.value ||
      listFlow?.sentList?.value
    );
  }

  if (step === 'sharedList') {
    return (
      listFlow?.signedList?.value ||
      listFlow?.sharedList?.value ||
      listFlow?.sentList?.value
    );
  }

  if (step === 'sentList') {
    return listFlow?.sharedList?.value || listFlow?.sentList?.value;
  }

  return false;
};
