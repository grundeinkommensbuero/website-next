import { useContext } from 'react';
import AvatarImage from '../../../components/AvatarImage';
import AuthContext from '../../../context/Authentication';
import { CustomMenuAction } from './CustomMenuAction';
import { CustomEntry, CustomMenuLink } from './CustomMenuLink';
import s from './style.module.scss';
import { XbgeAppContext } from '../../../context/App';
import LoginIcon from './icon-login.svg';

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

  if (!isAuthenticated) {
    return (
      <CustomMenuLink
        entry={entry}
        currentRoute={currentRoute}
        className={s.loginLink}
      >
        <LoginIcon className={s.loginIcon} alt="Login Illustration" />
      </CustomMenuLink>
    );
  }

  return (
    <div className="mx-2 items-center">
      {customUserData ? (
        <div className={s.dropdown}>
          <div className="items-center">
            <AvatarImage
              className={s.loginParentAvatar}
              user={customUserData}
              size="500"
            />
            <span className="nowrap">{customUserData.username}</span>
          </div>
          <div className={s.dropdownContent}>
            <ul>
              <li className="my-4 mt-8">
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
                      action: () => togglePageBuilder(),
                      label: 'Page Builder',
                    }}
                  />
                </li>
              )}
              <li className="my-4">
                <CustomMenuAction
                  entry={{ action: signUserOut, label: 'Abmelden' }}
                />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <span className="nowrap ml-2">Lade...</span>
      )}
    </div>
  );
};
