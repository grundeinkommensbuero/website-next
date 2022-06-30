import React, { useContext, useEffect } from 'react';

import AuthContext from '../../context/Authentication';
import { FinallyMessage } from '../../components/Forms/FinallyMessage';
import { useRouter } from 'next/router';
import { SectionWrapper } from '../../components/Section/SectionWrapper';

const MePage = () => {
  const { userId } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Get path after me/ to redirect to a specifc subpage of profile
    const splitPath = router.pathname.split('me/');
    const profilePath =
      splitPath.length <= 1 ? '' : splitPath[splitPath.length - 1];

    console.log('search', location.search);

    if (userId) {
      router.push(`/mensch/${userId}/${profilePath}${location.search}`);
    } else {
      router.push(`/login/?nextPage=me%2F${profilePath}${location.search}`);
    }
  }, [userId]);

  return (
    <SectionWrapper colorScheme="colorSchemeWhite">
      {/* TODO: refactor all the other FinallyMessages */}
      <FinallyMessage loading>Lade...</FinallyMessage>
    </SectionWrapper>
  );
};

export default MePage;
