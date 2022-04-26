import Link from 'next/link';
import { ReactElement, useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/Authentication';
import s from './style.module.scss';

export const BackToProfile = (): ReactElement => {
  const { userId } = useContext(AuthContext);
  const [profielId, setProfileId] = useState('/');

  useEffect(() => {
    setProfileId(`/mensch/${userId}`);
  }, [userId]);

  return (
    <div className={s.backToProfile}>
      <Link href={profielId}>Zurück zum Profil</Link>
    </div>
  );
};
