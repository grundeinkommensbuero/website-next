import React from 'react';
import CreatePledgePackage from '../../PledgePackage/CreatePledgePackage';
import gS from '../style.module.scss';
import s from './style.module.scss';
import { EditProfileSection } from '../EditProfileSection';
import { Link } from 'gatsby';

export const ProfilePledgePackage = ({
  userId,
  userData,
  updateCustomUserData,
  path,
}) => {
  return (
    <section className={gS.profilePageGrid}>
      <EditProfileSection className={s.createPledgePackageSection}>
        <div className={gS.backToProfile}>
          <Link to={`/mensch/${userId}/`}>Zurück zum Profil</Link>
        </div>
        <CreatePledgePackage
          userData={userData}
          updateCustomUserData={updateCustomUserData}
        />
      </EditProfileSection>
    </section>
  );
};
