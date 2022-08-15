import React from 'react';
import { SignatureCount } from '../../hooks/Api/Signatures/Get';
import VisualCounter from '../VisualCounter';
import s from './style.module.scss';

type SignatureStatsProps = {
  signatureCount: SignatureCount;
  layout?: 'horizontal' | 'vertical';
  className?: string;
};

const SignatureStats = ({
  signatureCount,
  layout,
  className,
}: SignatureStatsProps) => {
  return (
    <div className={className}>
      <div className={s.statisticsCountItem}>
        <div className={s.statisticsCount}>
          <VisualCounter end={signatureCount.scannedByUser} />
        </div>
        <div className={s.statisticsLabel}>
          Unterschriften
          {layout === 'horizontal' ? ' ' : <br />}
          von dir gemeldet
        </div>
      </div>{' '}
      {/* Deactivate for now because the count is hard to track */}
      {/* <div className={s.statisticsCountItem}>
        <div className={s.statisticsCount}>
          <VisualCounter end={signatureCount.received} />
        </div>
        <div className={s.statisticsLabel}>
          Unterschriften
          {layout === 'horizontal' ? ' ' : <br />}
          von dir bei uns
          {layout === 'horizontal' ? ' ' : <br />}
          angekommen
        </div>
      </div> */}
    </div>
  );
};

export default SignatureStats;
