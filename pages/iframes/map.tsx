import React from 'react';
import { ShowMeetups } from '../../components/CollectionMap/ShowMeetups';
import s from './style.module.scss';

const IframeMap = () => {
  return (
    <div className={`${s.page} py-4`}>
      <ShowMeetups
        isIframe={true}
        mapConfig={{
          state: 'climate',
          maxBounds: [
            [13.05, 52.2],
            [13.8, 52.8],
          ],
        }}
      />
    </div>
  );
};

export default IframeMap;
