import { strict as assert } from 'assert';
import Axios from 'axios';
import { normalizePair } from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface Ticker24hr {
  symbol: string;
  contract: string;
  currency: string;
  last: number;
  change: number;
  high: number;
  low: number;
  amount: number;
  volume: number;
}

export default async function get24hrVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get('https://api.newdex.io/v1/tickers');

  assert.equal(response.status, 200);
  assert.equal(response.data.code, 200);

  const data = response.data.data as Ticker24hr[];

  const result: { [key: string]: Volume } = {};
  data.forEach((x) => {
    const normalizedPair = normalizePair(x.symbol, 'Newdex');

    result[normalizedPair] = {
      baseVolume: x.amount,
      quoteVolume: x.volume,
    };
  });

  return result;
}
