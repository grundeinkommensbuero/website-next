import React, { useEffect, useState } from 'react';
import * as s from './style.module.less';
import * as gS from '../style.module.less';
import AvatarImage from '../../AvatarImage';
import ImageUpload from '../../Forms/ImageUpload';
import { Button } from '../../Forms/Button';
import ShareButtons from './ShareButtons.json';
import { mailBody } from './mailBody';
import cN from 'classnames';

import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

export const SharePreview = ({
  shareChannel,
  userData,
  userId,
  municipality,
  isInOnboarding,
}) => {
  const [showProfileImageUpload] = useState(false);
  const [useProfilePicture, setUseProfilePicture] = useState(
    userData?.profilePictures?.original
  );

  const downloadImage = image => {
    fetch(image.url, {
      method: 'GET',
      headers: {},
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', image.filename); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const InstagramHowTo = () => {
    return (
      <div>
        <h3 className={gS.moduleTitle}>So teilst du über Instagram:</h3>
        <p>
          Teile die Expedition über deine Insta-Story und zeige all deinen
          Freundinnen, dass du dabei bist. Schau direkt auf unserer Instagram
          Seite vorbei. Dort haben wir einige Posts und Stories zum teilen
          zusammengestellt.
        </p>

        <Button
          onClick={() =>
            window.open(
              'https://www.instagram.com/tv/CN7reFmqrVc/?igshid=1gc54jw6cni9p',
              '_blank'
            )
          }
        >
          Zu unserer Insta-Story
        </Button>

        <p>
          Oder einfach Datei runterladen, in deine Insta-Story einfügen und die
          @expedition.grundeinkommen verlinken.
        </p>

        <div className={s.instaImageContainer}>
          <button
            className={s.imageButton}
            onClick={() =>
              downloadImage({
                url: 'https://images.ctfassets.net/af08tobnb0cl/15Vjd0mpP0FpMwmgvP5RHw/1ceaf02a8a52c1bd0d779e9281a552a9/Launch_Story_Ich_bin_dabei.jpg?h=1000',
                filename: 'Launch_Story_Ich_bin_dabei.jpg',
              })
            }
            aria-label="Bild herunterladen"
          >
            <img
              className={s.sharePicInstagram}
              src="https://images.ctfassets.net/af08tobnb0cl/15Vjd0mpP0FpMwmgvP5RHw/1ceaf02a8a52c1bd0d779e9281a552a9/Launch_Story_Ich_bin_dabei.jpg?h=1000"
              alt="sharepic"
            />
          </button>
          <button
            className={s.imageButton}
            onClick={() =>
              downloadImage({
                url: 'https://images.ctfassets.net/af08tobnb0cl/4f7aQbZP37iUc0H0od4BAQ/c76cc9f24ef9970fffcd552ef6c45c5e/Launch_Story_Ich_bin_dabei_Nominierung.jpg?h=1000',
                filename: 'Launch_Story_Ich_bin_dabei_Nominierung.jpg',
              })
            }
            aria-label="Bild herunterladen"
          >
            <img
              className={s.sharePicInstagram}
              src="https://images.ctfassets.net/af08tobnb0cl/4f7aQbZP37iUc0H0od4BAQ/c76cc9f24ef9970fffcd552ef6c45c5e/Launch_Story_Ich_bin_dabei_Nominierung.jpg?h=1000"
              alt="sharepic"
            />
          </button>
        </div>

        <p>
          Du willst noch mehr? Dann nominiere direkt 3 Freundinnen und fordere
          Sie zur Teilnahme an unserer Aktion auf. Verlinke dazu die
          Accountnamen deiner Bekannten und @expedition.grundeinkommen auf der
          Story Vorlage und veröffentliche diese auf Instagram.
        </p>
      </div>
    );
  };

  const Components = {
    EmailShareButton,
    FacebookShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    InstagramHowTo,
  };

  const constructShareURL = () => {
    const addProfileImage = () =>
      useProfilePicture ? '&addProfilePicture=true' : '';
    let baseUrl = 'https://expedition-grundeinkommen.de/';
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.GATSBY_USE_DEV_BACKEND === 'override'
    ) {
      baseUrl =
        'https://campaign-launch--expedition-grundeinkommen.netlify.app/';
    }

    // Quickfix, if user id for some reason is not available
    if (userId) {
      return `${baseUrl}gemeinde-teilen/${userId}?ags=${
        municipality.ags
      }&version=1${addProfileImage()}`;
    } else {
      return baseUrl;
    }
  };

  const ShareButton = () => {
    let CaseButton =
      Components[
        ShareButtons.find(
          el => el.channelIdentifier === shareChannel?.channelIdentifier
        )?.name
      ];
    const title = `Bring das Grundeinkommen mit mir an den Staat! Melde dich dafür bei der Expedition Grundeinkommen an. Ich bin schon in ${municipality.name} dabei :)`;
    const hashtags = [
      'ModellversuchJetzt',
      'Grundeinkommen',
      'ExpeditionGrundeinkommen',
    ];
    const subject = `Gemeinsam bringen wir das Grundeinkommen nach ${municipality.name}`;
    const body = mailBody(municipality);
    const quote = `Bring das Grundeinkommen mit mir an den Staat! Melde dich dafür bei der Expedition Grundeinkommen an. Ich bin schon in ${municipality.name} dabei :)`;
    return (
      <>
        {CaseButton && shareChannel ? (
          <CaseButton
            title={title}
            hashtags={hashtags}
            subject={subject}
            body={body}
            quote={quote}
            url={constructShareURL()}
            className={gS.buttonRowSingle}
            windowWidth={1200}
            windowHeight={1000}
          >
            <button className={gS.selectableOption}>
              Über {shareChannel?.label?.replace(/\\/g, '')} teilen
            </button>
          </CaseButton>
        ) : null}
      </>
    );
  };

  useEffect(() => {
    setUseProfilePicture(userData?.profilePictures?.original);
  }, [userData]);

  return (
    <>
      {shareChannel?.channelIdentifier !== 'instagram' ? (
        <>
          <h3 className={gS.moduleTitle}>
            Über {shareChannel?.label.replace(/\\/g, '')} teilen
          </h3>
          <div className={s.sharePreviewContainer}>
            {useProfilePicture ? (
              <>
                <img
                  src={
                    'https://images.ctfassets.net/af08tobnb0cl/4LVqlgSyy9xfpnZvsABNlF/65e368bfbe1d3f7c650bf640927cb59d/Teilen-Leer.png?h=500'
                  }
                  alt={'sharing background'}
                  className={s.sharePreview}
                />
                <AvatarImage user={userData} className={s.avatarImage} />
              </>
            ) : (
              <img
                src={
                  'https://images.ctfassets.net/af08tobnb0cl/2JpoX7gHOGy49opxwetJXG/f5fa878ae57259ee0dcfbe7af45ddaf8/Teilen-Fallback-Leer.png?h=500'
                }
                alt={'sharing background'}
                className={s.sharePreview}
              />
            )}
            <h3
              className={cN(s.mainCaption, {
                [s.mainCaptionHuge]: !isInOnboarding,
              })}
            >
              {userData.username
                ? `${userData.username} bringt das #Grundeinkommen nach${' '}
                ${municipality.name}`
                : `Ich bringe das #Grundeinkomme nach${' '}
                ${municipality.name}`}
            </h3>
            <h4 className={s.subCaption}>Hol es auch in deinen Ort!</h4>
          </div>

          <ShareButton />

          {userData?.profilePictures?.original && (
            <div className={gS.optionSelectionContainer}>
              {useProfilePicture ? (
                <Button
                  onClick={() => setUseProfilePicture(!useProfilePicture)}
                >
                  Lieber kein Profilbild nutzen
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setUseProfilePicture(!useProfilePicture)}
                  >
                    Lieber mit Profilbild teilen
                  </Button>
                </>
              )}
            </div>
          )}

          {showProfileImageUpload && (
            <div className={s.imageUploadContainer}>
              <ImageUpload
                userData={userData}
                userId={userId}
                showUploadLabel={false}
                showEditLabel={true}
                size={'large'}
                onUploadDone={() => {}}
                smallSubmitButton={true}
              />
            </div>
          )}
        </>
      ) : (
        <InstagramHowTo />
      )}
    </>
  );
};
