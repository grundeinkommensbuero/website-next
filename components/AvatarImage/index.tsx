import React, { useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import Avatar1 from './avatar1.svg';
import Avatar2 from './avatar2.svg';
import { User } from '../../context/Authentication';

export type Sizes = '200' | '500' | '900' | '1200' | 'original';

type AvatarImageProps = {
  user: User;
  className?: string;
  sizes?: Sizes;
};

const AvatarImage = ({ user, className, sizes = '500' }: AvatarImageProps) => {
  const src = user?.profilePictures
    ? // @ts-ignore
      user?.profilePictures[sizes]
    : null;

  if (!src) {
    return <Avatar1 />;
  }

  return (
    <img
      className={cN(s.image, className)}
      src={src}
      alt={user && user.username && `Avatarbild von ${user.username}`}
    />
  );
};

export default AvatarImage;