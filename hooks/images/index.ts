import { SetStateAction, useState } from 'react';
import CONFIG from '../../backend-config';
import { Request } from '../Authentication/Verification';

export const useUploadImage = (): [
  string,
  (userId: string, image: any) => Promise<void>
] => {
  const [state, setState] = useState('');
  return [
    state,
    (userId: string, image: any) => uploadImage(userId, image, setState),
  ];
};

// Requests a presigned url and uploads image to S3
const uploadImage = async (
  userId: string,
  image: any,
  setState: React.Dispatch<SetStateAction<string>>
) => {
  try {
    setState('saving');
    const contentType = image.type;

    const uploadUrl = await requestPresignedUrl(userId, contentType);

    await uploadToS3(uploadUrl, image, contentType);

    setState('success');
  } catch (error: any) {
    if (error.status === 400 || error.status === 404) {
      setState('invalidRequest');
    } else {
      setState('error');
    }
  }
};

// Makes call to endpoint to get a so called presigned url to
// upload an image to S3
const requestPresignedUrl = async (userId: string, contentType: string) => {
  const request: Request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      contentType,
    }),
  };

  const response = await fetch(
    `${CONFIG.API.INVOKE_URL}/images/upload-url`,
    request
  );

  if (response.status === 201) {
    const { uploadUrl } = await response.json();
    return uploadUrl;
  } else {
    throw new Error(
      `Api response while requesting pre signed url was ${response.status}`
    );
  }
};

// Uses the presigned url to upload an image to S3
const uploadToS3 = async (
  uploadUrl: string,
  image: any,
  contentType: string
) => {
  const params = {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: image,
  };

  return fetch(uploadUrl, params);
};
