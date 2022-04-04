import React, { SetStateAction } from 'react';
import { Button } from '../../Forms/Button';
import { useDeleteUser } from '../../../hooks/Api/Users/Delete';
import { useSignOut } from '../../../hooks/Authentication';
import s from './style.module.scss';
import gS from '../style.module.scss';
// Get newsletter styles from Newsletter-Settings
import nS from '../ProfileNotifications/style.module.scss';
import toast from 'react-hot-toast';

type DeleteUserAccountProps = {
  userId: string;
  setShowDeleteAccountDialog: React.Dispatch<SetStateAction<boolean>>;
};

export const DeleteAccountDialog = ({
  userId,
  setShowDeleteAccountDialog,
}: DeleteUserAccountProps) => {
  const deleteUser = useDeleteUser();
  const signOut = useSignOut();

  const deleteUserAccount = () => {
    signOut();
    toast('Dein Account wird gelöscht!');
    setTimeout(() => {
      signOut();
      deleteUser();
      toast.success('Dein Account wurde gelöscht!');
    }, 3000);
  };

  return (
    <section className={nS.newsletterCard}>
      <p className={nS.newsletterCardHeading}>
        Bist du sicher, dass du deinen Account löschen möchtest?
      </p>
      <br />
      <p className={nS.newsletterCardDescription}>
        Diese Aktion kann nicht rückgängig gemacht werden!
      </p>
      <div className={s.revokeButtonRow}>
        <Button
          className={s.revokeButton}
          onClick={() => setShowDeleteAccountDialog(false)}
        >
          Abbrechen
        </Button>
        <Button className={s.revokeButton} onClick={() => deleteUserAccount()}>
          Account endgültig löschen
        </Button>
      </div>
    </section>
  );
};
