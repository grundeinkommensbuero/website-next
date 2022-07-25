import React from 'react';
import CreatePledgePackage from '../../PledgePackage/CreatePledgePackage';
import gS from '../style.module.scss';
import Link from 'next/link';
import { User } from '../../../context/Authentication';
import { EditProfileSection } from '../EditProfileSection';

export const ProfilePledgePackage = ({
  userData,
  updateCustomUserData,
}: {
  userData: User;
  updateCustomUserData: () => void;
}) => {
  return (
    <section className={gS.profilePageGrid}>
      <EditProfileSection>
        <div className={gS.backToProfile}>
          <Link href={'/sammelpakete'}>Zurück zu allen Paketen</Link>
        </div>
        <CreatePledgePackage
          userData={userData}
          updateCustomUserData={updateCustomUserData}
        />
      </EditProfileSection>
    </section>
  );
};
