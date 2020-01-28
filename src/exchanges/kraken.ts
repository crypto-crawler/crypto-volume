import { strict as assert } from 'assert';
import Axios from 'axios';
import normalize from 'crypto-pair';
import { Volume } from '../pojo/volume';

const ALL_PAIRS = [
  'ADAETH',
  'ADAEUR',
  'ADAUSD',
  'ADAXBT',
  'ALGOETH',
  'ALGOEUR',
  'ALGOUSD',
  'ALGOXBT',
  'ATOMETH',
  'ATOMEUR',
  'ATOMUSD',
  'ATOMXBT',
  'BATETH',
  'BATEUR',
  'BATUSD',
  'BATXBT',
  'BCHEUR',
  'BCHUSD',
  'BCHXBT',
  'DAIEUR',
  'DAIUSD',
  'DAIUSDT',
  'DASHEUR',
  'DASHUSD',
  'DASHXBT',
  'EOSETH',
  'EOSEUR',
  'EOSUSD',
  'EOSXBT',
  'ETHCHF',
  'ETHDAI',
  'ETHUSDC',
  'ETHUSDT',
  'GNOETH',
  'GNOEUR',
  'GNOUSD',
  'GNOXBT',
  'ICXETH',
  'ICXEUR',
  'ICXUSD',
  'ICXXBT',
  'LINKETH',
  'LINKEUR',
  'LINKUSD',
  'LINKXBT',
  'LSKETH',
  'LSKEUR',
  'LSKUSD',
  'LSKXBT',
  'NANOETH',
  'NANOEUR',
  'NANOUSD',
  'NANOXBT',
  'OMGETH',
  'OMGEUR',
  'OMGUSD',
  'OMGXBT',
  'PAXGETH',
  'PAXGEUR',
  'PAXGUSD',
  'PAXGXBT',
  'QTUMETH',
  'QTUMEUR',
  'QTUMUSD',
  'QTUMXBT',
  'SCETH',
  'SCEUR',
  'SCUSD',
  'SCXBT',
  'USDCEUR',
  'USDCUSD',
  'USDCUSDT',
  'USDTCAD',
  'USDTEUR',
  'USDTGBP',
  'USDTZUSD',
  'WAVESETH',
  'WAVESEUR',
  'WAVESUSD',
  'WAVESXBT',
  'XBTCHF',
  'XBTDAI',
  'XBTUSDC',
  'XBTUSDT',
  'XDGEUR',
  'XDGUSD',
  'XETCXETH',
  'XETCXXBT',
  'XETCZEUR',
  'XETCZUSD',
  'XETHXXBT',
  'XETHZCAD',
  'XETHZEUR',
  'XETHZGBP',
  'XETHZJPY',
  'XETHZUSD',
  'XLTCXXBT',
  'XLTCZEUR',
  'XLTCZUSD',
  'XMLNXETH',
  'XMLNXXBT',
  'XMLNZEUR',
  'XMLNZUSD',
  'XREPXETH',
  'XREPXXBT',
  'XREPZEUR',
  'XREPZUSD',
  'XTZETH',
  'XTZEUR',
  'XTZUSD',
  'XTZXBT',
  'XXBTZCAD',
  'XXBTZEUR',
  'XXBTZGBP',
  'XXBTZJPY',
  'XXBTZUSD',
  'XXDGXXBT',
  'XXLMXXBT',
  'XXLMZEUR',
  'XXLMZUSD',
  'XXMRXXBT',
  'XXMRZEUR',
  'XXMRZUSD',
  'XXRPXXBT',
  'XXRPZCAD',
  'XXRPZEUR',
  'XXRPZJPY',
  'XXRPZUSD',
  'XZECXXBT',
  'XZECZEUR',
  'XZECZUSD',
];

interface Ticker {
  a: string[];
  b: string[];
  c: string[];
  v: string[];
  p: string[];
  t: number[];
  l: string[];
  h: string[];
  o: string;
}

export default async function getVolume(): Promise<{ [key: string]: Volume }> {
  const response = await Axios.get(
    `https://api.kraken.com/0/public/Ticker?pair=${ALL_PAIRS.join(',')}`,
  );
  assert.equal(response.status, 200);
  const data = response.data.result as { [key: string]: Ticker };

  const result: { [key: string]: Volume } = {};

  Object.keys(data).forEach(rawPair => {
    const normalizedPair = normalize(rawPair, 'Kraken');
    const ticker = data[rawPair];

    const baseVolume = parseFloat(ticker.v[1]);
    const price = parseFloat(ticker.p[1]);
    const quoteVolume = baseVolume * price;

    result[normalizedPair] = {
      baseVolume,
      quoteVolume,
    };
  });

  return result;
}
