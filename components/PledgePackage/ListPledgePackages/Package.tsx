import React, { useEffect, useContext } from 'react';
import cN from 'classnames';
import s from './style.module.scss';
import AvatarImage from '../../AvatarImage';
import AuthContext from '../../../context/Authentication';
import {
  InteractionWithUser,
  useGetMostRecentInteractions,
  useUpdateInteraction,
} from '../../../hooks/Api/Interactions';
import PackageSvg from '../package.svg';
import CheckIcon from '../check.svg';
import { LoadingAnimation } from '../../LoadingAnimation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { InlineLinkButton } from '../../Forms/Button';

type PackageProps = InteractionWithUser & {
  belongsToCurrentUser?: boolean;
  showDone?: boolean;
};

export const Package = ({
  body,
  user,
  createdAt,
  id,
  done,
  belongsToCurrentUser = false,
  showDone = false,
}: PackageProps) => {
  const [pledgeUpdateState, updatePledgePackage] = useUpdateInteraction();
  const { updateCustomUserData } = useContext(AuthContext);
  const [, , getInteractions] = useGetMostRecentInteractions();

  useEffect(() => {
    if (pledgeUpdateState === 'saved') {
      toast.success(
        <p>
          Super!{' '}
          <Link href="/me/unterschriften-eintragen">
            Trag hier deine Unterschriften ein
          </Link>{' '}
          und lass den Balken steigen.
        </p>,
        {
          duration: 12000,
          position: 'bottom-right',
        }
      );

      getInteractions(null, 0, 'pledgePackage');
      updateCustomUserData();
    }
  }, [pledgeUpdateState]);

  return (
    <div
      className={cN(s.fullPackage, {
        [s.extraBottomMargin]: belongsToCurrentUser || showDone,
      })}
    >
      <div className={s.packageIconContainer}>
        <PackageSvg className={s.packageIcon} alt="Symbolbild eines Paketes" />
        <AvatarImage className={s.avatar} user={user as any} size="200" />
        {belongsToCurrentUser ? (
          <>
            {pledgeUpdateState === 'saving' ? (
              <div className={s.loadingPackageUpdate}>
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {!done && pledgeUpdateState !== 'saved' ? (
                  <button
                    onClick={() =>
                      updatePledgePackage({
                        id: id,
                        done: true,
                      })
                    }
                    className={cN(s.linkLikeFormattedButton, s.setDone)}
                  >
                    <b>Als erledigt markieren</b>
                  </button>
                ) : (
                  <p className={s.isDone}>
                    <CheckIcon className={s.checkIcon} alt="Häkchen-Icon" />
                    <b>ERLEDIGT!</b>
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {showDone && (
              <p className={s.isDone}>
                <CheckIcon className={s.checkIcon} alt="Häkchen-Icon" />
                <b>ERLEDIGT!</b>
              </p>
            )}
          </>
        )}
      </div>
      <div className={s.packageTextContainer}>
        <h4 className={s.name}>{user.username}</h4>
        <p className={s.createdAt}>Vor {getElapsedTime(createdAt)}</p>
        {body && <p className={s.quote}>&quot;{body}&quot;</p>}
      </div>
    </div>
  );
};

const getElapsedTime = (createdAt: string) => {
  const endTime = new Date();
  const startTime = new Date(createdAt);
  const timeDiff = endTime.getTime() - startTime.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? 'Monat' : 'Monate'}`;
  } else if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? 'Woche' : 'Wochen'}`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'Tag' : 'Tage'}`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
  } else if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? 'Sekunde' : 'Sekunden'}`;
  }
};
