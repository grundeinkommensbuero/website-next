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
    let Placeholder;
    // Choose random placeholder avatar
    if (Math.round(Math.random() * 1) === 0) {
      Placeholder = Avatar1;
    } else {
      Placeholder = Avatar2;
    }

    return <Placeholder className={cN(s.image, className)} alt="Avatarbild" />;
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
