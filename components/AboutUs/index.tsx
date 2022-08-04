import React from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import TwitterIcon from './icons/twitter-brands.svg';
import LinkedinIcon from './icons/linkedin-brands.svg';
import WebsiteIcon from './icons/globe-europe-solid.svg';
import { DirectusImage } from '../Util/DirectusImage';

const ICONS: any = {
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  website: WebsiteIcon,
};

export type TeamMember = {
  name: string;
  image: {
    id: string;
  };
  role?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
};

type AboutUsProps = {
  members?: TeamMember[];
  className?: string;
};

const AboutUs = ({ members, className }: AboutUsProps) => {
  if (!members) {
    return null;
  }

  console.log(members);

  return (
    <ul className={cN(s.aboutUs, className)}>
      {members.map(
        ({ name, image, role, twitter, linkedin, website }, index) => {
          const links = [
            { link: twitter, icon: 'twitter' },
            { link: linkedin, icon: 'linkedin' },
            { link: website, icon: 'website' },
          ].filter(link => {
            return !!link.link;
          });

          return (
            <li key={index} className={s.member}>
              {image && (
                <div className={s.imageContainer}>
                  <DirectusImage
                    assetId={image.id}
                    className={s.image}
                    overrideHeight={200}
                    overrideWidth={200}
                    alt="Foto eines Teammitglieds"
                  />
                  {!!links.length && (
                    <div className={s.socialMediaButtons}>
                      {links.map(link => (
                        <SocialMediaButton
                          key={link.icon}
                          name={name}
                          {...link}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className={s.label}>
                <div dangerouslySetInnerHTML={{ __html: name }} />
                {role && <div className={s.role}>{role}</div>}
              </div>
            </li>
          );
        }
      )}
    </ul>
  );
};

type SocialMediaButtonProps = {
  icon: any;
  name: string;
  link?: string;
};

const SocialMediaButton = ({ icon, link, name }: SocialMediaButtonProps) => {
  if (!link) {
    return null;
  }

  let title;

  if (icon === 'twitter') {
    title = `${name} bei Twitter`;
  } else if (icon === 'linkedin') {
    title = `${name} bei LinkedIn`;
  } else {
    title = `${name} im Internet`;
  }

  const Icon = ICONS[icon];

  return (
    <>
      <a
        href={link}
        aria-label={title}
        className={s.socialMediaButton}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
      >
        <Icon />
      </a>{' '}
    </>
  );
};

export default AboutUs;
