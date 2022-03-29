import Link from 'next/link';
import React from 'react';
import s from './style.module.scss';

export const LoggedOutHint = () => {
  return (
    <h2 className={s.loggedOutHint}>
      <Link href="/login">Logg dich ein</Link>, um diese Seite zu sehen.
    </h2>
  );
};
