import { useContext } from 'react';
import AvatarImage from '../../../../components/AvatarImage';
import AuthContext from '../../../../context/Authentication';
import { CustomMenuAction } from '../CustomMenuAction';
import { CustomEntry, CustomMenuLink } from '../CustomMenuLink';
import s from '../style.module.scss';
import { XbgeAppContext } from '../../../../context/App';
import { useRouter } from 'next/router';

type UserMenuLinkMobileProps = {
  entry: CustomEntry;
  currentRoute: string;
  extraCallback?: () => void;
};

export const UserMenuLinkMobile = ({
  entry,
  currentRoute,
  extraCallback,
}: UserMenuLinkMobileProps) => {
  const { isAuthenticated, customUserData, userId, signUserOut } =
    useContext(AuthContext);
  const { togglePageBuilder } = useContext(XbgeAppContext);

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
              size="500"
            />
            <span className="text-xl nowrap">{customUserData.username}</span>
          </div>
          <ul className="mx-2">
            <li className="my-4">
              <CustomMenuLink
                currentRoute={currentRoute}
                entry={{
                  id: '1',
                  slug: `/mensch/${userId}`,
                  label: 'Zum Profil',
                }}
              />
            </li>
            {customUserData?.directus?.token && (
              <li className="my-4">
                <CustomMenuAction
                  entry={{
                    action: () => {
                      togglePageBuilder();
                      if (extraCallback) extraCallback();
                    },
                    label: 'Page Builder',
                  }}
                />
              </li>
            )}
            <li className="my-4">
              <CustomMenuAction
                entry={{
                  action: () => {
                    signUserOut();
                    if (extraCallback) extraCallback();
                  },
                  label: 'Abmelden',
                }}
              />
            </li>
          </ul>
        </>
      ) : (
        <span className="text-xl nowrap ml-2">Lade...</span>
      )}
    </>
  );
};
