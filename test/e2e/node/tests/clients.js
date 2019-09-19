const stubs = require('../stubs')
const delay = require('delay')
const params = require('../params')
const utils = require('../utils')

describe('clients', () => {

  const clients = []
  let signalingServers

  async function logClients() {
    return
    console.log(JSON.stringify(await Promise.all(clients.map(async (client) => {
      return {
        nonce: client.nonce.getHex(),
        offersCount: client.offers.length,
        extroverts: await Promise.all(client.extroverts.map(async (extrovert) => {
          const offer = await extrovert.fetchOffer()
          return {
            createdAgo: utils.pollenium.utils.getNow() - extrovert.createdAt,
            // offerSdp: offer ? offer.sdpb.getUtf8(): null,
            offerId: offer ? offer.getId().getHex(): null,
            peerClientNonce: extrovert.peerClientNonce ? extrovert.peerClientNonce.getHex() : null,
            status: extrovert.status,
          }
        })),
        introverts: client.introverts.map((introvert) => {
          return {
            createdAgo: utils.pollenium.utils.getNow() - introvert.createdAt,
            // offerSdp: introvert.offer.sdpb.getUtf8(),
            offerId: introvert.offer.getId().getHex(),
            peerClientNonce: introvert.peerClientNonce ? introvert.peerClientNonce.getHex() : null,
            status: introvert.status,
          }
        })
      }
    })), null, 2))
  }

  const interval = setInterval(logClients, 1000)


  before(async() => {
    signalingServers = await stubs.signalingServers
  })

  after(() => {
    stubs.clients.resolve(clients)
  })

  it(`should create ${params.clientsCount} clients`, async () => {
    for (let i = 0; i < params.clientsCount; i++) {
      const client = new utils.pollenium.Client({
        signalingServerUrls: params.signalingServerPorts.map((port) => {
          return `ws://localhost:${port}`
        }),
        bootstrapOffersTimeout: (i % 2 === 0) ? 0 : 5,
        signalTimeout: 5, // utils.isBrowser ? 5 : 2,
        friendsMax: params.friendsCount,
        Worker: utils.Worker,
        WebSocket: utils.WebSocket,
        wrtc: utils.wrtc,
        hashcashWorkerUrl: utils.hashcashWorkerUrl
      })

      if (utils.isBrowser) {
        console.log(client)
      }

      await delay(2000)

      clients.push(client)
    }
  })
  it('wait for 0 friends to be connecting', (done) => {

    function getIsFullyConnected() {
      for (let i = 0; i < clients.length; i ++) {
        if (!clients[i].getIsFullyConnected()) {
          return false
        }
      }
      return true
    }

    if (getIsFullyConnected()) {
      console.log('started fully connected')
      done()
    }

    async function onFriendStatus() {
      if (!getIsFullyConnected()) {
        return
      }

      clients.forEach((client) => {
        client.removeListener('friend.status', onFriendStatus)
      })
      clearInterval(interval)
      done()
    }

    clients.forEach((client) => {
      client.on('friend.status', onFriendStatus)
    })


  })

})
