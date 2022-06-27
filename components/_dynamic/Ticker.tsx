import { ReactElement } from 'react';
import TickerToSignup from '../TickerToSignup';

const Ticker = (): ReactElement => {
  return <TickerToSignup tickerDescription={{ tickerDescription: 'Hello' }} />;
};

export default Ticker;
