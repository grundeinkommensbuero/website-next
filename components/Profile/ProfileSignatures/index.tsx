import React, { useEffect, useState } from 'react';
import s from './style.module.scss';
import gS from '../style.module.scss';
import Head from 'next/head';
import SelfScan from '../../../components/Forms/SelfScan';
import campaignCodes from './campaignCodes.json';
import { CampaignScanVisualisation } from '../../Forms/SelfScan/CampaignScanVisualisation';
import { EditProfileSection } from '../EditProfileSection';
import { BackToProfile } from '../BackToProfile';
import { User } from '../../../context/Authentication';
import { CampaignVisualisation } from '../../CampaignVisualisations';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

const pageTitle = 'Selbsteingabe Unterschriftsliste';

type Campaign = {
  campaignName: string;
  campaignCode: string;
  ags: string;
  successMessage: string;
};

type ProfileSignaturesProps = {
  userData: User;
  campaignVisualisations: CampaignVisualisation[];
};

export const ProfileSignatures = ({
  userData,
  campaignVisualisations,
}: ProfileSignaturesProps) => {
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>(
    IS_BERLIN_PROJECT ? [campaignCodes[0]] : []
  );

  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    if (userData && userData.municipalities && !IS_BERLIN_PROJECT) {
      const activeCampaigns: Campaign[] = [];
      userData.municipalities.forEach(mun => {
        campaignCodes.forEach(campCode => {
          if (mun.ags === campCode.ags) {
            activeCampaigns.push(campCode);
          }
        });
      });
      setUserCampaigns(activeCampaigns);
    }
  }, [userData]);

  return (
    <section className={gS.profilePageGrid}>
      <EditProfileSection>
        <BackToProfile />

        <section className={s.signatureSection}>
          <Head>
            <title key="title">{pageTitle}</title>
            <meta key="og:title" property="og:title" content={pageTitle} />
          </Head>

          <section>
            <SelfScan
              successMessage={
                'Danke! Bitte schicke die Listen möglichst schnell an: Expedition Grundeinkommen, Gneisenaustraße 63, 10961 Berlin'
              }
              campaignCode={
                userCampaigns.length === 1
                  ? userCampaigns[0].campaignCode
                  : undefined
              }
              onUpdate={() => {
                setUpdated(updated + 1);
              }}
            />
            {userCampaigns[0] ? (
              userCampaigns.map((scan, index) => {
                return (
                  <div className={s.signatureContainer} key={index}>
                    <h2>Eingegangene Unterschriften {scan.campaignName}</h2>
                    <CampaignScanVisualisation
                      campaignCode={scan.campaignCode}
                      campaignVisualisations={campaignVisualisations}
                      triggerUpdate={updated}
                    />
                  </div>
                );
              })
            ) : (
              <h3>
                Du bist für keine Kampagne angemeldet, die gerade Unterschriften
                sammelt.
              </h3>
            )}
          </section>
        </section>
      </EditProfileSection>
    </section>
  );
};
