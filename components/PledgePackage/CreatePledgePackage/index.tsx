import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import s from './style.module.scss';
import { Form, Field } from 'react-final-form';
import { Button } from '../../Forms/Button';
import { TextInputWrapped } from '../../Forms/TextInput';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { useSaveInteraction } from '../../../hooks/Api/Interactions';
import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import AvatarImage from '../../AvatarImage';
import Package from '../package.svg';
import { Speechbubble } from '../Speechbubble/index';
import {
  mapCampaignCodeToAgs,
  mapCampaignCodeToState,
} from '../../../utils/mapCampaignCode';
import { User } from '../../../context/Authentication';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type PledgePackage = {
  body: string;
};

const CreatePledgePackage = ({
  userData,
  updateCustomUserData,
}: {
  userData: User;
  updateCustomUserData: () => void;
}) => {
  const [pledgePackageState, uploadPledgePackage] = useSaveInteraction();
  const [, setPledgePackage] = useState<PledgePackage>();
  const [, updateUser] = useUpdateUser();
  const [campaignCode, setCampaignCode] = useState('berlin-2');

  useEffect(() => {
    if (!IS_BERLIN_PROJECT) {
      const urlParams = querystring.parse(window.location.search);
      if (
        urlParams.campaignCode &&
        typeof urlParams.campaignCode === 'string'
      ) {
        setCampaignCode(urlParams.campaignCode);
      } else {
        if (userData?.municipalities?.length) {
          // Find and sort all collecting municipalities of the user
          const collectingCitiesOfUser = getCities();
          if (collectingCitiesOfUser?.length) {
            // If there were any, use the most recent one
            const indexOfMostRecent = collectingCitiesOfUser.length - 1;
            if (collectingCitiesOfUser[indexOfMostRecent].ags === '11000000') {
              setCampaignCode('berlin-2');
            } else if (
              collectingCitiesOfUser[indexOfMostRecent].ags === '04011000'
            ) {
              setCampaignCode('bremen-1');
            } else if (
              collectingCitiesOfUser[indexOfMostRecent].ags === '02000000'
            ) {
              setCampaignCode('hamburg-1');
            }
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (pledgePackageState === 'saved') {
      const ags = mapCampaignCodeToAgs(campaignCode);

      // Sign up user for municipality if they aren't already
      const shouldSignUpForMunicipality =
        ags &&
        !userData?.municipalities?.find(
          municipality => municipality.ags === ags
        );

      // If user does not have newsletter consent, or already has newsletter of campaign
      // or already has unsubscribed from campaign (newsletter.value is false in that case), we do nothing.
      // Otherwise we give user newsletter for campaign.
      const shouldSubscribeToNewsletter =
        userData.newsletterConsent.value &&
        userData?.customNewsletters?.findIndex(
          newsletter => newsletter.ags === ags
        ) === -1;

      const data: any = {};

      if (shouldSignUpForMunicipality) {
        data.ags = ags;
      }

      if (shouldSubscribeToNewsletter) {
        data.customNewsletters = [
          ...(userData.customNewsletters ? userData.customNewsletters : []),
          {
            name: mapCampaignCodeToState(campaignCode),
            ags,
            value: true,
            extraInfo: false,
            timestamp: new Date().toISOString(),
          },
        ];
      }

      if (shouldSubscribeToNewsletter || shouldSignUpForMunicipality) {
        updateUser(data);
      }

      if (updateCustomUserData) {
        updateCustomUserData();
      }
    }
  }, [pledgePackageState]);

  const getCities = () => {
    return userData.municipalities
      ?.filter(
        municipality =>
          municipality.ags === '11000000' ||
          municipality.ags === '04011000' ||
          municipality.ags === '02000000'
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  if (pledgePackageState === 'error') {
    return (
      <section>
        <FinallyMessage>
          <>
            {pledgePackageState === 'error' && (
              <>Das Absenden hat nicht geklappt. </>
            )}
            <br />
            <br />
            Probiere es bitte ein weiteres Mal oder melde dich bei uns mit dem
            Hinweis zu der genauen Fehlermeldung. Nenne uns bitte außerdem falls
            möglich deinen Browser und die Version:
            <br />
            <br />
            <a href="mailto:support@expedition-grundeinkommen.de">
              support@expedition-grundeinkommen.de
            </a>
          </>
        </FinallyMessage>
      </section>
    );
  }

  if (pledgePackageState === 'saving') {
    return (
      <section>
        <FinallyMessage loading>Speichere...</FinallyMessage>
      </section>
    );
  }

  return (
    <>
      {pledgePackageState === 'saved' && (
        <section>
          <FinallyMessage>Du hast dir ein Paket genommen!</FinallyMessage>
        </section>
      )}
      <Form
        onSubmit={(data: PledgePackage) => {
          setPledgePackage({
            body: data.body,
          });

          if (uploadPledgePackage) {
            uploadPledgePackage({
              ...data,
              campaignCode,
              type: 'pledgePackage',
            });
          }
        }}
        validate={validate}
        render={({ handleSubmit }) => (
          <section>
            <form onSubmit={handleSubmit}>
              <h2>Sammelpaket nehmen</h2>
              <section className={s.flexContainer}>
                <div className={s.bubbleElement}>
                  <Speechbubble>
                    <Field
                      name="body"
                      label="Warum sammelst du für's Grundeinkommen?"
                      placeholder="Dein Grund (Maximal 70 Zeichen)"
                      type="textarea"
                      maxLength={70}
                      component={TextInputWrapped as any}
                      inputClassName={s.bodyInput}
                      errorClassName={s.error}
                      hideLabel={true}
                    />
                  </Speechbubble>
                  <div className={s.belowBubble}>
                    <AvatarImage
                      user={userData}
                      className={s.avatar}
                      size="200"
                    />
                  </div>
                </div>
                <div className={s.descriptionTextElement}>
                  <p>
                    Mit dem Sammelpaket versprichst du, 25 Unterschriften
                    einzusammeln. Das ist super!
                    <br />
                    <br />
                    Optional: Erzähle der Welt, warum du für&apos;s
                    Grundeinkommen sammelst.
                  </p>
                  <div className={s.submitButtonContainer}>
                    <Package
                      alt="Grafik eines Paketes"
                      className={s.packageIcon}
                    />
                    <Button type="submit" className={s.submitButton}>
                      Paket schnappen
                    </Button>
                  </div>
                </div>
              </section>
            </form>
          </section>
        )}
      ></Form>
    </>
  );
};

const validate = (values: { body?: string }) => {
  const errors: { body?: string } = {};

  if (values.body && values.body.length > 70) {
    errors.body = 'Der Text darf nicht länger als 70 Zeichen sein.';
  }

  return errors;
};

export default CreatePledgePackage;
