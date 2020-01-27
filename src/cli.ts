#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import getVolume from './index';

const EXCHANGES = ['Binance', 'Bitfinex', 'Bitstamp', 'Huobi', 'Newdex', 'WhaleEx'];

const { argv } = yargs
  // eslint-disable-next-line no-shadow
  .command('$0 <exchange>', 'Get 24 hours volume', yargs => {
    yargs.positional('exchange', {
      choices: EXCHANGES,
      type: 'string',
      describe: 'The exchange name',
    });
  });

(async () => {
  const volume = await getVolume(argv.exchange as string);
  console.info(volume);
})();
