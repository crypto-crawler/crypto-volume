import { strict as assert } from 'assert';
import Axios from 'axios';
import normalize from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface Ticker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get('https://api.binance.com/api/v3/ticker/24hr');

  assert.equal(response.status, 200);

  const data = response.data as Ticker24hr[];

  const result: { [key: string]: Volume } = {};
  data.forEach(x => {
    const normalizedPair = normalize(x.symbol, 'Binance');

    result[normalizedPair] = {
      baseVolume: parseFloat(x.volume),
      quoteVolume: parseFloat(x.quoteVolume),
    };
  });

  return result;
}
