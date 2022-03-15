import React, { ReactElement, useEffect, useState } from 'react';

type NoSsrProps = {
  children: ReactElement;
};

export const NoSsr = ({ children }: NoSsrProps): ReactElement => {
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return <>{isMounted ? children : null}</>;
};
