import { Client, ClientSummary } from '../classes/Client'
import { MissiveGenerator } from '../classes/MissiveGenerator'
import { Missive } from '../classes/Missive'
import { Uu } from 'pollenium-uvaursi'
import {
  signalingServerUrls,
  clientsCount,
  maxFriendshipsCount,
  missivesCount,
  expectedMissiveReceivesCount
} from './lib/params'
import delay from 'delay'
import fs from 'fs'
import { Primrose } from 'pollenium-primrose'
import wrtc from 'wrtc'
import TinyWorker from 'tiny-worker'
const missives: Array<Missive> = []


let clients: Array<Client> = []

const intervalId = setInterval(() => {
  fs.writeFileSync(
    `${__dirname}/../../clients.test.json`,
    JSON.stringify(
      clients.map((client) => {
        return client.getSummary().toJsonable()
      }).map((clientSummaryJsonable) => {
        if (clientSummaryJsonable.partySummary.connectedFriendshipsCount === maxFriendshipsCount) {
          return 'Fully Connected'
        } else {
          return clientSummaryJsonable
        }
      }),
      null, 2
    )
  )
}, 1000)

test('create clients', async () => {
  for (let i = 0; i < clientsCount; i++) {
    const client = new Client({
      signalingServerUrls,
      maxFriendshipsCount,
      bootstrapOffersTimeout: i % 2 ? 0 : 5,
      maxOfferAttemptsCount: 2,
      wrtc: wrtc,
      missiveLatencyTolerance: 10,
      sdpTimeout: 10,
      connectionTimeout: 10,
      maxOfferLastReceivedAgo: 10,
      offerReuploadInterval: 5
    })
    clients.push(client)

    await delay(1000)
  }
}, clientsCount * 1000 + 5000)

test('await fullyConnected', async () => {
  await Promise.all(clients.map((client) => {
    return new Promise((resolve, reject) => {
      const handleId = client.summarySnowdrop.addHandle((summary: ClientSummary) => {
        const connectedFriendshipsCount = summary.partySummary.getFriendshipsCountByStatus(2)
        if (connectedFriendshipsCount !== maxFriendshipsCount) {
          return
        } else {
          client.summarySnowdrop.removeHandleById(handleId)
          resolve()
        }
      })
    })
  }))

  clearInterval(intervalId)
}, 600000)

test('create missives', async () => {
  for (let i = 0; i < missivesCount; i++) {
    const missiveGenerator = new MissiveGenerator({
      applicationId: Uu.genRandom(32),
      applicationData: Uu.genRandom(32),
      difficulty: 1,
      ttl: 30,
      hashcashWorker: new TinyWorker(`${__dirname}/../../node/hashcash-worker.js`, [], { esm: true })
    })

    const missive = await missiveGenerator.fetchMissive()
    missives.push(missive)
  }
})

test('missive', async () => {
  let receivesCount = 0
  clients.forEach((client) => {
    client.missiveSnowdrop.addHandle(async (_missive) => {
      receivesCount++
      if (receivesCount === expectedMissiveReceivesCount) {
        await delay(2000)
        if (receivesCount !== expectedMissiveReceivesCount) {
          throw new Error('Received too many times')
        }
      }
    })
  })
  missives.forEach((missive) => {
    clients[0].broadcastMissive(missive)
  })
})
