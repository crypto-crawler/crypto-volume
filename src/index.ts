import { strict as assert } from 'assert';
import getVolumeBinance from './exchanges/binance';
import getVolumeBitfinex from './exchanges/bitfinex';
import getVolumeHuobi from './exchanges/huobi';
import getVolumeNewdex from './exchanges/newdex';
import getVolumeWhaleEx from './exchanges/whaleex';
import { Volume } from './pojo/volume';

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
    case 'Huobi': {
      return getVolumeHuobi();
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
