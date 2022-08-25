import React, { useState } from 'react';
import s from './style.module.scss';
import { ShareButtonRow } from './ShareButtonRow';
import { User } from '../../context/Authentication';
import Image from 'next/image';
import Head from 'next/head';

export type Channel = {
  name: string;
  label: string;
  channelIdentifier: string;
};

type CirclesSharingFeatureProps = {
  userData: User;
  userId: string;
};

export const CirclesSharingFeature = ({
  userData,
  userId,
}: CirclesSharingFeatureProps) => {
  return (
    <>
      <Head>
        <title key="title">{'Volksentscheid Grundeinkommen'}</title>
        <meta
          key="description"
          name="description"
          content={'Modellversuch zum Grundeinkommen jetzt!'}
        />
        <meta
          key="og:title"
          property="og:title"
          content={'Grundeinkommen ausprobieren - mit Circles'}
        />
        <meta
          key="og:description"
          property="og:description"
          content={'Modellversuch zum Grundeinkommen jetzt!'}
        />
      </Head>
      <section className={s.shareContainer}>
        <div className={s.previewCalloutContainer}>
          <div className={s.previewElement}>
            <h2>Hol so viele Menschen dazu, wie du kannst</h2>
            <p>
              Je mehr Menschen du zur Expedition einlädst, desto besser stehen
              die Chancen.
            </p>
          </div>
          <div className={s.sharePreviewElement}>
            <Image
              src={
                'https://directus.volksentscheid-grundeinkommen.de/assets/c094224b-a5d0-4911-899d-67019e7b2a0a'
              }
              alt={'Teilen Vorschau'}
              width={440}
              height={337}
            />
          </div>
        </div>
        <ShareButtonRow userData={userData} userId={userId} />
      </section>
    </>
  );
};

// Default export needed for lazy loading
export default CirclesSharingFeature;
