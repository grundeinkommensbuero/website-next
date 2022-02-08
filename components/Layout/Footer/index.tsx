import React from 'react';
import s from './style.module.scss';
import { Follow } from '../../SocialMedia/Follow';
import { ReactElement } from 'react';

export const Footer = (): ReactElement => (
  <footer className={s.footer}>
    <div className={s.itemContainer}>
      <div className='text-d-lg'>
        © Expedition Grundeinkommen {new Date().getFullYear()}
      </div>
      <Follow className={s.socialMedia} />
    </div>
  </footer>
);
