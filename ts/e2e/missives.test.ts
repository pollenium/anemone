import { fetchClients } from './clients.test'
import { Client } from '../classes/Client'
import { MissiveGenerator } from '../classes/MissiveGenerator'
import { Missive } from '../classes/Missive'
import { Uu } from 'pollenium-uvaursi'
import { missivesCount, missivesReceivesCount as expectedReceivesCount } from './lib/params'
import TinyWorker from 'tiny-worker'
import delay from 'delay'

let clients: Array<Client>
const missives: Array<Missive> = []

test('fetch clients', async () => {
  clients = await fetchClients()
})

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
      if (receivesCount === expectedReceivesCount) {
        await delay(2000)
        if (receivesCount !== expectedReceivesCount) {
          throw new Error('Received too many times')
        }
      }
    })
  })
  missives.forEach((missive) => {
    clients[0].broadcastMissive(missive)
  })
})
