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
    // See: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
    // The slug in query should usually only be empty or an array, but theoretically
    // could also be a string
    let profilePath = '';

    if (typeof router.query.slug === 'string') {
      profilePath = router.query.slug;
    } else if (typeof router.query.slug !== 'undefined') {
      // Should only have 1 element in the array, but maybe
      // in the future we will have profile sub pages with more nesting
      profilePath = router.query.slug.join('/');
    }

    if (userId) {
      router.push(`/mensch/${userId}/${profilePath}${location.search}`);
    } else {
      router.push(`/login/?nextPage=me%2F${profilePath}${location.search}`);
    }
  }, [userId]);

  return (
    <SectionWrapper colorScheme="colorSchemeWhite">
      <FinallyMessage loading>Lade...</FinallyMessage>
    </SectionWrapper>
  );
};

export default MePage;
