import { strict as assert } from 'assert';
import Axios from 'axios';
import { Volume } from '../pojo/volume';

const SUPPORTED_PAIRS = [
  'ADA_USDT',
  'AE_USDT',
  'ALGO_USDT',
  'ARPA_USDT',
  'BCH_USDT',
  'BNB_USDT',
  'BSV_USDT',
  'BTC_USDT',
  'DASH_USDT',
  'DOGE_USDT',
  'EOS_USDT',
  'ETH_USDT',
  'GRIN_USDT',
  'HT_USDT',
  'IRIS_USDT',
  'LTC_USDT',
  'NAS_USDT',
  'OMG_USDT',
  'ONT_USDT',
  'SERO_USDT',
  'TRX_USDT',
  'VSYS_USDT',
  'XLM_USDT',
  'XRP_USDT',
  'ZEC_USDT',
  'ZIL_USDT',
];

interface Ticker {
  volume: string;
  high: string;
  low: string;
  buy: string;
  sell: string;
  open: string;
  last: string;
  percentChange: string;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const tickers: Ticker[] = [];
  for (let i = 0; i < SUPPORTED_PAIRS.length; i += 1) {
    const pair = SUPPORTED_PAIRS[i];
    // eslint-disable-next-line no-await-in-loop
    const response = await Axios.get(`https://www.mxc.com/open/api/v1/data/ticker?market=${pair}`);
    // const responses = await Promise.all(SUPPORTED_PAIRS.map(pair =>Axios.get(`https://www.mxc.com/open/api/v1/data/ticker?market=${pair}`))); // data: { code: 10001, msg: '请求太频繁' }
    assert.equal(response.status, 200);
    assert.equal(response.data.code, 200);

    tickers.push(response.data.data);
  }

  const result: { [key: string]: Volume } = {};

  for (let i = 0; i < SUPPORTED_PAIRS.length; i += 1) {
    const normalizedPair = SUPPORTED_PAIRS[i];
    const ticker = tickers[i];

    const baseVolume = parseFloat(ticker.volume);
    const price =
      (parseFloat(ticker.high) +
        parseFloat(ticker.low) +
        parseFloat(ticker.open) +
        parseFloat(ticker.last)) /
      4;
    const quoteVolume = baseVolume * price;

    result[normalizedPair] = {
      baseVolume,
      quoteVolume,
    };
  }

  return result;
}
