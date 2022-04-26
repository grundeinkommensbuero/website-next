import React, { useEffect, useState } from 'react';
import s from './style.module.scss';
import gS from '../style.module.scss';
import cN from 'classnames';
import { Helmet } from 'react-helmet-async';
import SelfScan from '../../../components/Forms/SelfScan';
import campaignCodes from './campaignCodes.json';
import { CampainScanVisualisation } from '../../Forms/SelfScan/CampaignScanVisualisation';
import { EditProfileSection } from '../EditProfileSection';
import { BackToProfile } from '../BackToProfile';
import { User } from '../../../context/Authentication';
import { CampaignVisualisation } from '../../CampaignVisualisations';

type CampaignCode = {
  campaignName: string;
  campaignCode: string;
  ags: string;
  successMessage: string;
};

type ProfileSignaturesProps = {
  userId: string;
  userData: User;
  campaignVisualisations: CampaignVisualisation[];
};

export const ProfileSignatures = ({
  userId,
  userData,
  campaignVisualisations,
}: ProfileSignaturesProps) => {
  const [userCampaigns, setUserCampaigns] = useState<CampaignCode[]>([]);

  useEffect(() => {
    if (userData && userData.municipalities) {
      const activeCampaigns: CampaignCode[] = [];
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
          {/* <Helmet>
            <title>Selbsteingabe Unterschriftsliste</title>
          </Helmet> */}

          <section>
            <SelfScan
              className={''}
              successMessage={
                'Danke! Bitte schicke die Listen möglichst schnell an: Expedition Grundeinkommen, Gneisenaustraße 63, 10961 Berlin'
              }
            />
            {userCampaigns[0] ? (
              userCampaigns.map((scan, index) => {
                return (
                  <div className={s.signatureContainer} key={index}>
                    <h2>Eingegangene Unterschriften {scan.campaignName}</h2>
                    <CampainScanVisualisation
                      campaignCode={scan.campaignCode}
                      campaignVisualisations={campaignVisualisations}
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
