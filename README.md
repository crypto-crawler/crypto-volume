# crypto-volume

Get last 24 hours trade volume of all pairs.

## Quick start

```bash
npx crypto-volume Binance
```

## How to use

```javascript
/* eslint-disable import/no-unresolved,no-console */
const getVolume = require('crypto-volume').default;

(async (): Promise<void> => {
  console.info(await getVolume('Binance'));
})();
```

## API Manual

There is only one API in this library:

```typescript
/**
 * Get last 24 hours trade volume of all pairs.
 *
 * @param exchange Thee exchange name
 * @returns Last 24 hours trade volume
 */
export default function getVolume(exchange: string): Promise<{ [key: string]: Volume }>;
```
