/* globals test */

import WebSocket from 'isomorphic-ws'
import { Uu } from 'pollenium-uvaursi'
import delay from 'delay'
import fs from 'fs'
import wrtc from 'wrtc'
import TinyWorker from 'tiny-worker'

import { Client } from '../../classes/Client'
import { MissiveGenerator } from '../../classes/MissiveGenerator'
import { Missive } from '../../classes/Missive'
import {
  signalingServerUrls,
  clientsCount,
  maxFriendshipsCount,
  missivesCount,
  expectedMissiveReceivesCount,
} from './lib/params'
import { FRIENDSHIP_STATUS } from '../../classes/Friendship'

const missives: Array<Missive> = []
const clients: Array<Client> = []

const intervalId = setInterval(() => {
  const clientSummaryJsonables = clients.map((client) => {
    const clientSummary = client.getSummary()
    if (
      clientSummary.struct.partySummary.getFriendshipsCountByStatus(FRIENDSHIP_STATUS.CONNECTED)
      === maxFriendshipsCount
    ) {
      return 'Fully Connected'
    }
    return clientSummary.toJsonable()
  })
  const clientSummariesJson = JSON.stringify(clientSummaryJsonables, null, 2)
  fs.writeFileSync(`${__dirname}/../../../clients.test.json`, clientSummariesJson)
}, 1000)

test(
  'create clients',
  async () => {
    for (let i = 0; i < clientsCount; i++) {
      const client = new Client({
        signalingServerUrls,
        maxFriendshipsCount,
        bootstrapOffersTimeout: i % 2 ? 0 : 5,
        maxOfferAttemptsCount: 2,
        wrtc,
        WebSocket,
        missiveLatencyTolerance: 10,
        sdpTimeout: 10,
        connectionTimeout: 10,
        maxOfferLastReceivedAgo: 10,
        offerReuploadInterval: 5,
      })
      clients.push(client)

      await delay(1000)
    }
  },
  clientsCount * 1000 + 5000,
)

test('await fullyConnected', async () => {
  await Promise.all(
    clients.map((client) => {
      return new Promise((resolve): void => {
        const handleId = client.summarySnowdrop.addHandle((summary) => {
          const connectedFriendshipsCount = summary.struct.partySummary.getFriendshipsCountByStatus(
            FRIENDSHIP_STATUS.CONNECTED,
          )
          if (connectedFriendshipsCount === maxFriendshipsCount) {
            client.summarySnowdrop.removeHandleById(handleId)
            resolve()
          }
        })
      })
    }),
  )

  clearInterval(intervalId)
}, 600000)

test('create missives', async () => {
  for (let i = 0; i < missivesCount; i++) {
    const missiveGenerator = new MissiveGenerator({
      applicationId: Uu.genRandom(32),
      applicationData: Uu.genRandom(32),
      difficulty: 1,
      ttl: 30,
      hashcashWorker: new TinyWorker(`${__dirname}/../../../node/hashcash-worker.js`, [], {
        esm: true,
      }),
    })

    const missive = await missiveGenerator.fetchMissive()
    missives.push(missive)
  }
})

test('missive', async () => {
  let receivesCount = 0
  clients.forEach((client) => {
    client.missiveSnowdrop.addHandle(async () => {
      receivesCount += 1
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
