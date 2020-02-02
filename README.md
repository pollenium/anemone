# anemone

Anemone is collection of Pollenium client and signaling servers for typescript, node, and the browser.

>  ⚠️ anemone is still in beta

## Importing

````
import { Client, MissiveGenerator } from 'pollenium-anemone'
import { Uu } from 'pollenium-uvaursi' /* Uint8Array utilities *?
````

### Node

````
const pollenium = require('pollenium-anemone')
````

### Browser

````
<script type="text/javascript" src="./pollenium-anemone/browser/"></script>
````

## Creating a Client

```
const client = new pollenium.Client({
  signalingServerUrls: [
    'ws://unsecured-signaling-server.com',
    'wss://secured-signaling-server'
  ],
  maxFriendshipsCount: 6,
  wrtc: isBrowser ? wrtc : require('wrtc')
  bootstrapOffersTimeout: 10,
  maxOfferAttemptsCount: 2,
  wrtc: any,
  missiveLatencyTolerance: 30
})
```

## Missives

Missives require hashcash proof of work. This hashcash proof of work is generated asynchronously in a seperate thread so that it does not block the main execution.

````
const applicationId = Uu.fromUtf8('your-app-id').padLeft(32)
const applicationData = Uu.genRandom(32)
const difficulty = 6

const Worker = isWorker ? Worker : require('tiny-worker')
const missiveGenerator = new pollenium.MissiveGenerator({
  applicationId,
  applicationData,
  difficulty,
  hashcashWorker: new Worker('pollenium-anemone/node/hashcash-worker.js', [], { esm: true })
)

const missive = await missiveGenerator.fetchMissive()

client.broadcastMissive(missve)
````

Listen for incoming missives on the client's missive Snowdrop

````
client.missiveSnowdrop.addHandle((missive) => {
  doThing(missive.applicationData)
})
````
