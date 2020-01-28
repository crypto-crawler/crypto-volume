import { strict as assert } from 'assert';
import getVolumeBinance from './exchanges/binance';
import getVolumeBitfinex from './exchanges/bitfinex';
import getVolumeBitstamp from './exchanges/bitstamp';
import getVolumeCoinbase from './exchanges/coinbase';
import getVolumeHuobi from './exchanges/huobi';
import getVolumeKraken from './exchanges/kraken';
import getVolumeNewdex from './exchanges/newdex';
import getVolumeWhaleEx from './exchanges/whaleex';
import { Volume } from './pojo/volume';

export { Volume } from './pojo/volume';

/**
 * Get last 24 hours trade volume of all pairs.
 *
 * @param exchange Thee exchange name
 * @returns Last 24 hours trade volume
 */
export default async function getVolume(exchange: string): Promise<{ [key: string]: Volume }> {
  assert.ok(exchange);

  switch (exchange) {
    case 'Binance': {
      return getVolumeBinance();
    }
    case 'Bitfinex': {
      return getVolumeBitfinex();
    }
    case 'Bitstamp': {
      return getVolumeBitstamp();
    }
    case 'Coinbase': {
      return getVolumeCoinbase();
    }
    case 'Huobi': {
      return getVolumeHuobi();
    }
    case 'Kraken': {
      return getVolumeKraken();
    }
    case 'Newdex': {
      return getVolumeNewdex();
    }
    case 'WhaleEx': {
      return getVolumeWhaleEx();
    }
    default:
      throw new Error(`Unsupported exchange: ${exchange}`);
  }
}
