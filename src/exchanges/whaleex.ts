import { strict as assert } from 'assert';
import Axios from 'axios';
import { normalizePair } from 'crypto-pair';
import { Volume } from '../pojo/volume';

interface SymbolInfo {
  name: string;
  baseCurrency: string;
  quoteCurrency: string;
  baseVolume: string;
  quoteVolume: string;
  priceChangePercent: string;
  enable: boolean;
  status: 'ON' | 'OFF';
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const result: { [key: string]: Volume } = {};

  const response = await Axios.get('https://api.whaleex.com/BUSINESS/api/public/symbol');
  assert.equal(response.status, 200);
  assert.equal(response.statusText, 'OK');

  const arr = response.data as Array<SymbolInfo>;

  arr.forEach((x) => {
    const normalizedPair = normalizePair(x.name, 'WhaleEx');

    result[normalizedPair] = {
      baseVolume: parseFloat(x.baseVolume),
      quoteVolume: parseFloat(x.quoteVolume),
    };
  });

  return result;
}
