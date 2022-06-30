import { useContext } from 'react';
import AvatarImage from '../../../../components/AvatarImage';
import AuthContext from '../../../../context/Authentication';
import { CustomMenuAction } from '../CustomMenuAction';
import { CustomEntry, CustomMenuLink } from '../CustomMenuLink';
import s from '../style.module.scss';
import { XbgeAppContext } from '../../../../context/App';
import { useRouter } from 'next/router';

type UserMEnuLinkMobileProps = {
  entry: CustomEntry;
  currentRoute: string;
  extraCallback?: () => void;
};

export const UserMenuLinkMobile = ({
  entry,
  currentRoute,
  extraCallback,
}: UserMEnuLinkMobileProps) => {
  const { isAuthenticated, customUserData, userId, signUserOut } =
    useContext(AuthContext);
  const { togglePageBuilder } = useContext(XbgeAppContext);
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <CustomMenuLink
        isMobile={true}
        entry={entry}
        currentRoute={currentRoute}
        extraCallback={extraCallback}
      />
    );
  }

  return (
    <>
      {customUserData ? (
        <>
          <div className="items-center my-4">
            <AvatarImage
              className={s.loginParentAvatar}
              user={customUserData}
              sizes="500"
            />
            <span className="text-xl nowrap">{customUserData.username}</span>
          </div>
          <div className="mx-2">
            <div className="my-4">
              <CustomMenuAction
                entry={{
                  action: () => {
                    router.push(`/mensch/${userId}`);
                    if (extraCallback) extraCallback();
                  },
                  label: 'Zum Profil',
                }}
              />
            </div>
            {customUserData?.directus?.token && (
              <div className="my-4">
                <CustomMenuAction
                  entry={{
                    action: () => {
                      togglePageBuilder();
                      if (extraCallback) extraCallback();
                    },
                    label: 'Page Builder',
                  }}
                />
              </div>
            )}
            <div className="my-4">
              <CustomMenuAction
                entry={{
                  action: () => {
                    signUserOut();
                    if (extraCallback) extraCallback();
                  },
                  label: 'Abmelden',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <span className="text-xl nowrap ml-2">Lade...</span>
      )}
    </>
  );
};
