import { useContext } from 'react';
import AvatarImage from '../../../components/AvatarImage';
import AuthContext from '../../../context/Authentication';
import { CustomMenuAction } from './CustomMenuAction';
import { CustomEntry, CustomMenuLink } from './CustomMenuLink';
import s from './style.module.scss';
import { XbgeAppContext } from '../../../context/App';
import { useRouter } from 'next/router';

export const UserMenuLink = ({
  entry,
  currentRoute,
}: {
  entry: CustomEntry;
  currentRoute: string;
}) => {
  const { isAuthenticated, customUserData, userId, signUserOut } =
    useContext(AuthContext);
  const { togglePageBuilder } = useContext(XbgeAppContext);
  const router = useRouter();

  if (!isAuthenticated) {
    return <CustomMenuLink entry={entry} currentRoute={currentRoute} />;
  }

  return (
    <>
      {customUserData ? (
        <div className={s.dropdown}>
          <div className="items-center">
            <AvatarImage
              className={s.loginParentAvatar}
              user={customUserData}
              sizes="500"
            />
            <span className="text-xl nowrap">{customUserData.username}</span>
          </div>
          <div className={s.dropdownContent}>
            <div className="my-4 mt-8">
              <CustomMenuAction
                entry={{
                  action: () => router.push(`/mensch/${userId}`),
                  label: 'Zum Profil',
                }}
              />
            </div>
            {customUserData?.directus?.token && (
              <div className="my-4">
                <CustomMenuAction
                  entry={{
                    action: () => togglePageBuilder(),
                    label: 'Page Builder',
                  }}
                />
              </div>
            )}
            <div className="my-4">
              <CustomMenuAction
                entry={{ action: signUserOut, label: 'Abmelden' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <span className="text-xl nowrap ml-2">Lade...</span>
      )}
    </>
  );
};
