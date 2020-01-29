import { strict as assert } from 'assert';
import Axios from 'axios';
import normalize from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface Ticker24hr {
  best_ask: string;
  best_bid: string;
  instrument_id: string;
  product_id: string;
  last: string;
  last_qty: string;
  ask: string;
  best_ask_size: string;
  bid: string;
  best_bid_size: string;
  open_24h: string;
  high_24h: string;
  low_24h: string;
  base_volume_24h: string;
  timestamp: string;
  quote_volume_24h: string;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get('https://www.okex.com/api/spot/v3/instruments/ticker');

  assert.equal(response.status, 200);

  const data = response.data as Ticker24hr[];

  const result: { [key: string]: Volume } = {};
  data.forEach(x => {
    const normalizedPair = normalize(x.product_id, 'OKEx_Spot');
    assert.equal(normalizedPair, x.product_id.replace(/-/, '_'));

    result[normalizedPair] = {
      baseVolume: parseFloat(x.base_volume_24h),
      quoteVolume: parseFloat(x.quote_volume_24h),
    };
  });

  return result;
}
