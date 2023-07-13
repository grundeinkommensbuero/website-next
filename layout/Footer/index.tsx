import React from 'react';
import s from './style.module.scss';
import { Follow } from '../SocialMedia/Follow';
import { ReactElement } from 'react';
import { Menu } from '../../utils/getMenus';
import { FooterMenu } from './FooterMenu';
import cN from 'classnames';
import LogoExpedition from '../logo-expedition.svg';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

type FooterProps = {
  footerMenu: Menu;
};

export const Footer = ({ footerMenu }: FooterProps): ReactElement => (
  <footer
    className={cN(
      s.footer,
      { [s.black]: IS_BERLIN_PROJECT },
      { [s.hamburg]: IS_HAMBURG_PROJECT }
    )}
  >
    <div className={s.itemContainer}>
      <div className="text-d-lg">
        {IS_BERLIN_PROJECT && (
          <>
            <div className={s.berlinInfos}>
              <span>Eine Initiative von</span>
              <LogoExpedition
                className={s.logo}
                alt={'Expedition Grundeinkommen'}
                color={'white'}
              />
            </div>
            <span>
              <a
                href="https://www.expedition-grundeinkommen.de"
                className={s.expeditionsLink}
              >
                expedition-grundeinkommen.de
              </a>
            </span>
          </>
        )}
        © Expedition Grundeinkommen {new Date().getFullYear()}
      </div>
      <Follow className={s.socialMedia} />
      <FooterMenu footerMenu={footerMenu} />
    </div>
  </footer>
);
