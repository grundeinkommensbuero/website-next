import React, { useEffect, useState, useContext } from 'react';
import { Form, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import s from './style.module.scss';
import cN from 'classnames';

import { useUploadImage } from '../../../hooks/images';
import AvatarImage from '../../AvatarImage';
import { Spinner } from '../../Spinner';

import AuthContext from '../../../context/Authentication';
import { Button } from '../Button';

export default ({
  userData,
  userId,
  onUploadDone,
  onImageChosen,
  size = 'default',
  buttonOnAquaBackground = false,
  smallSubmitButton = false,
}) => {
  const [uploadImageState, uploadImage] = useUploadImage();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [imageUploadIsProcessing, setImageUploadIsProcessing] = useState(false);
  const [showUploadSuccessMessage, setShowUploadSuccessMessage] =
    useState(false);
  const [showUploadErrorMessage, setShowUploadErrorMessage] = useState(false);

  const { updateCustomUserData } = useContext(AuthContext);

  useEffect(() => {
    if (uploadImageState === 'success') {
      setImageUploadIsProcessing(false);
      setShowUploadSuccessMessage(true);
      setTimeout(() => {
        setShowUploadSuccessMessage(false);
      }, 1500);

      if (onUploadDone) {
        onUploadDone();
      }

      let counter = 0;
      // Try to fetch new profile picture
      const tryUpdateUserData = setInterval(() => {
        if (counter < 3) {
          updateCustomUserData();
          counter++;
        } else {
          window.clearInterval(tryUpdateUserData);
        }
      }, 7500);
    }
    if (uploadImageState === 'error') {
      setImageUploadIsProcessing(false);
      setShowUploadErrorMessage(true);
    }
  }, [uploadImageState]);

  return (
    <Form
      onSubmit={({ image }) => {
        if (image && image.files && image.files[0]) {
          uploadImage(userId, image.files[0]);
          setUnsavedChanges(false);
          setImageUploadIsProcessing(true);
        }
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={s.imageUploadContainer}>
          <>
            <div className={s.avatarImageContainer}>
              <Field
                name="image"
                component={ImageInput}
                user={userData}
                size={size}
                unsavedChanges={unsavedChanges}
                showUploadLabel={
                  !(
                    imageUploadIsProcessing ||
                    showUploadSuccessMessage ||
                    showUploadErrorMessage
                  )
                }
                onChange={() => {}}
              />
              <OnChange name="image">
                {() => {
                  setUnsavedChanges(true);
                  if (onImageChosen) {
                    onImageChosen();
                  }
                }}
              </OnChange>
            </div>

            {unsavedChanges ? (
              <Button
                type="submit"
                className={cN(s.submitButton, {
                  [s.buttonOnAquaBackground]: buttonOnAquaBackground,
                })}
                size={smallSubmitButton && 'SMALL'}
              >
                Hochladen
              </Button>
            ) : null}

            <div className={s.uploadMessageContainer}>
              {imageUploadIsProcessing ? (
                <span className={s.uploadStateMessage}>
                  <Spinner />
                  <b className={s.loadingMsg}>Bild hochladen...</b>
                </span>
              ) : (
                <>
                  {showUploadSuccessMessage ? (
                    <span className={s.uploadStateMessage}>
                      Upload erfolgreich!
                    </span>
                  ) : null}
                  {showUploadErrorMessage ? (
                    <span className={s.uploadStateMessage}>
                      Fehler beim Upload! :(
                      <br />
                      Bitte versuche es später erneut!
                    </span>
                  ) : null}
                </>
              )}
            </div>
          </>
        </form>
      )}
    />
  );
};

export const ImageInput = ({
  input: { value, onChange, ...input },
  user,
  size,
  unsavedChanges,
  showUploadLabel,
}) => {
  const [avatarImage, setAvatarImage] = useState(null);

  const handleChange = ({ target }) => {
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]);
      reader.onload = e => {
        setAvatarImage(e.target.result);
        onChange({ files: target.files, srcOverwrite: e.target.result });
      };
    } else {
      onChange({ files: target.files });
    }
  };

  return (
    <label
      id="imageUpload"
      className={s.avatarImageContainer}
      aria-label="Lade ein Bild hoch"
    >
      <AvatarImage
        srcOverwrite={avatarImage}
        aria-label="Lade ein Bild hoch"
        className={cN(
          s.avatarImage,
          { [s.defaultSize]: size === 'default' },
          { [s.large]: size === 'large' }
        )}
        user={user}
        sizes="80px"
      />
      {showUploadLabel ? (
        <>
          {(user && user.profilePictures) || unsavedChanges ? (
            <div className={cN(s.avatarImageLabel)}>Bild ändern</div>
          ) : (
            <div className={cN(s.avatarImageLabel)}>Lad’ ein Bild hoch!</div>
          )}
        </>
      ) : null}
      <input
        tabIndex="0"
        type="file"
        onChange={handleChange}
        className={s.avatarUploadButton}
        accept="image/png, image/jpeg"
        aria-labelledby="imageUpload"
        {...input}
      />
    </label>
  );
};
