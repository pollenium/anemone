# anemone

Anemone is collection of Pollenium client and signaling servers for typescript, node, and the browser.

>  ⚠️ anemone is still in beta

## Importing

### Typescript

````
import { Client, Bytes, MissiveGenerator } from 'pollenium-anemone/ts'
````

### Node

````
const pollenium = require('pollenium-anemone/node')
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
  friendshipsMax: 6,
  Worker: isBrowser ? Worker : require('tiny-worker'),
  WebSocket: isBrowser ? WebSocket : require('isomorphic-ws'),
  wrtc: isBrowser ? wrtc : require('wrtc'),
  hashcashWorkerUrl: 'path/to/hashcash-worker.js'
})
```

## Friendships

After creating a client, the client will automatically create friendship. You can monitor progress by listening to the `friendship.status` event

````
client.friendshipStatusSnowdrop.addHandle((friendship) => {
  ...
})
````

## Missives

Missives require hashcash proof of work. This hashcash proof of work is generated asynchronously in a seperate thread so that it does not block the main execution.

````
const applicationId = pollenium.Bytes.fromUtf8('your-app-id').padLeft(32)
const applicationData = pollenium.Bytes.random(32)
const difficulty = 6

const missiveGenerator = new pollenium.MissiveGenerator({
  client,
  applicationId,
  applicationData,
  difficulty
)

const missive = await missiveGenerator.fetchMissive()

missive.broadcast()
````
