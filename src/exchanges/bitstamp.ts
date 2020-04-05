import { strict as assert } from 'assert';
import Axios from 'axios';
import { Volume } from '../pojo/volume';

interface Ticker {
  high: string;
  last: string;
  timestamp: string;
  bid: string;
  vwap: string;
  volume: string;
  low: string;
  ask: string;
  open: string;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const pairsResponse = await Axios.get('https://www.bitstamp.net/api/v2/trading-pairs-info/');
  assert.equal(pairsResponse.status, 200);

  const ALL_PAIRS = (pairsResponse.data as { name: string }[]).map((x) => x.name.replace('/', '_'));

  const requests = ALL_PAIRS.map((pair) =>
    Axios.get(
      `https://www.bitstamp.net/api/v2/ticker/${pair.toLocaleLowerCase().replace(/_/, '')}/`,
    ),
  );
  const responses = await Promise.all(requests);

  const result: { [key: string]: Volume } = {};

  for (let i = 0; i < ALL_PAIRS.length; i += 1) {
    const response = responses[i];
    assert.equal(response.status, 200);

    const ticker = response.data as Ticker;
    const baseVolume = parseFloat(ticker.volume);
    const price = parseFloat(ticker.vwap);
    const quoteVolume = price * baseVolume;

    result[ALL_PAIRS[i]] = {
      baseVolume,
      quoteVolume,
    };

    if (ALL_PAIRS[i].endsWith('_USD')) {
      result[ALL_PAIRS[i]].usdVolume = quoteVolume;
    }
  }

  return result;
}
