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
            <p>
              Um deine Wallet zu aktivieren und mit Circles bezahlen zu können,
              musst du mindestens 3 Circles-User:innen finden, die dich in ihr
              Vertrauensnetzwerk aufnehmen.
            </p>{' '}
            <p>
              Dafür haben wir für dich Nachrichten vorbereitet, die du in deinen
              Social Media Accounts teilen kannst. So findest du schnell die
              Menschen, die dir vertrauen.
            </p>
            <p>
              {' '}
              Du kannst auch bei einer{' '}
              <a
                href="https://volksentscheid-grundeinkommen.de#karte"
                target="_blank"
                rel="noreferrer"
              >
                Sammelaktion
              </a>{' '}
              vorbeikommen - dort sind immer Menschen von der Expedition vor
              Ort, die deinen Account verifizieren. Dazu brauchst du nur deinen
              Usernamen.
            </p>
            <p>
              {' '}
              Oder du fragst in unserer{' '}
              <a href="https://bit.ly/3KoOXMI" target="_blank" rel="noreferrer">
                Telegram-Gruppe
              </a>{' '}
              nach Menschen, die dich freischalten.
            </p>
            <p>
              {' '}
              Sobald deine Wallet aktiviert ist, beginnt dein Grundeinkommen zu
              fließen. Du erhältst dann jeden Tag 24 Circles, die du ausgeben
              oder in Gutscheine eintauschen kannst.
            </p>
          </div>
          <div className={s.sharePreviewElement}>
            <Image
              src={
                'https://directus.volksentscheid-grundeinkommen.de/assets/134b420a-f6a6-4f9f-b65c-d3b53010d7ac'
              }
              alt={'Teilen Vorschau'}
              width={803}
              height={549}
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
