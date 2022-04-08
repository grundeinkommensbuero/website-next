import Link from 'next/link';
import { ReactElement, useContext } from 'react';
import AuthContext from '../../context/Authentication';
import s from './style.module.scss';

export const BackToProfile = (): ReactElement => {
  const { userId } = useContext(AuthContext);
  return (
    <div className={s.backToProfile}>
      <Link href={userId ? `/mensch/${userId}` : '/'}>Zurück zum Profil</Link>
    </div>
  );
};
