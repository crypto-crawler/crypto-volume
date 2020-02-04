import { strict as assert } from 'assert';
import Axios from 'axios';
import normalize from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface Ticker24hr {
  open: number;
  close: number;
  low: number;
  high: number;
  amount: number;
  count: number;
  vol: number;
  symbol: string;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get('https://api.huobi.pro/market/tickers');

  assert.equal(response.status, 200);
  assert.equal(response.data.status, 'ok');

  const data = (response.data.data as Ticker24hr[]).filter(x => x.amount > 0 && x.vol > 0);

  const result: { [key: string]: Volume } = {};
  data.forEach(x => {
    const normalizedPair = normalize(x.symbol, 'Huobi');

    result[normalizedPair] = {
      baseVolume: x.amount,
      quoteVolume: x.vol,
    };
  });

  return result;
}
