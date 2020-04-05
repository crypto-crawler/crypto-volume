import { strict as assert } from 'assert';
import Axios from 'axios';
import { normalizePair } from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface Ticker {
  open: string;
  high: string;
  low: string;
  volume: string;
  last: string;
}

interface Stats {
  [key: string]: {
    stats_30day: { volume: string };
    stats_24hour: Ticker;
  };
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get('https://api.pro.coinbase.com/products/stats');
  assert.equal(response.status, 200);

  const stats: Stats = response.data;

  const result: { [key: string]: Volume } = {};

  Object.keys(stats).forEach((productId) => {
    const pair = normalizePair(productId, 'CoinbasePro');
    assert.equal(pair, productId.replace(/-/, '_'));
    const ticker = stats[productId].stats_24hour;

    const baseVolume = parseFloat(ticker.volume);
    const price =
      (parseFloat(ticker.open) +
        parseFloat(ticker.last) +
        parseFloat(ticker.high) +
        parseFloat(ticker.low)) /
      4;
    const quoteVolume = price * baseVolume;

    result[pair] = {
      baseVolume,
      quoteVolume,
    };

    if (pair.endsWith('_USD')) {
      result[pair].usdVolume = quoteVolume;
    }
  });

  return result;
}
