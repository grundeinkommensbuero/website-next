import React, { useState } from 'react';
import s from './style.module.scss';
import { ShareButtonRow } from './ShareButtonRow';
import { User } from '../../context/Authentication';

export type Channel = {
  name: string;
  label: string;
  channelIdentifier: string;
};

type CirclesSharingFeatureProps = {
  userData: User;
  userId: string;
  introText?: string;
};

export const CirclesSharingFeature = ({
  userData,
  userId,
  introText,
}: CirclesSharingFeatureProps) => {
  const [sharePreviewActive, setSharePreviewActive] = useState(false);
  const [shareChannel, setShareChannel] = useState<Channel>();

  return (
    <section className={s.municipalityShareContainer}>
      <ShareButtonRow
        setShareChannel={setShareChannel}
        setSharePreviewActive={setSharePreviewActive}
      />
    </section>
  );
};

// Default export needed for lazy loading
export default CirclesSharingFeature;
