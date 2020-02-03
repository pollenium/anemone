import { Client, ClientSummary } from '../classes/Client'
import { signalingServerUrls, clientsCount, maxFriendshipsCount } from './lib/params'
import delay from 'delay'
import fs from 'fs'
import { Primrose } from 'pollenium-primrose'
import wrtc from 'wrtc'

let clients: Array<Client> = []
const clientsPrimrose = new Primrose<Array<Client>>()

export function fetchClients() {
  return clientsPrimrose.promise
}

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
      sdpTimeout: 5,
      connectionTimeout: 10
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
  clientsPrimrose.resolve(clients)
}, 600000)
