import React from 'react';
import s from './style.module.scss';
import { Follow } from '../SocialMedia/Follow';
import { ReactElement } from 'react';
import { Menu } from '../../utils/getMenus';
import { FooterMenu } from './FooterMenu';

type FooterProps = {
  footerMenu: Menu;
};

export const Footer = ({ footerMenu }: FooterProps): ReactElement => (
  <footer className={s.footer}>
    <div className={s.itemContainer}>
      <div className="text-d-lg">
        © Expedition Grundeinkommen {new Date().getFullYear()}
      </div>
      <Follow className={s.socialMedia} />
      <FooterMenu footerMenu={footerMenu} />
    </div>
  </footer>
);
