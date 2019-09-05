const SignalingServer = require('../js/classes/SignalingServer').SignalingServer
const Client = require('../js/classes/Client').Client
const FRIEND_STATUS = require('../js/classes/Friend').FRIEND_STATUS
const Bytes = require('../js/classes/Bytes').Bytes
const stubs = require('./stubs')
const delay = require('delay')
const fs = require('fs')
const debug = require('debug')
const params = require('./params')
const Worker = require('tiny-worker')

const signalingServerPorts = [5010, 5011, 5012]
const signalingServers = []
const clients = []

describe('clients', () => {

  after(() => {
    stubs.clients.resolve(clients)
  })

  it('should create servers', () => {
    signalingServerPorts.forEach((port) => {
      signalingServers.push(new SignalingServer(port))
    })
  })
  it(`should create ${params.clientsCount} clients`, async () => {
    for (let i = 0; i < params.clientsCount; i++) {
      const client = new Client({
        signalingServerUrls: signalingServerPorts.map((port) => {
          return `ws://localhost:${port}`
        }),
        friendsMax: params.friendsCount,
        Worker: Worker
      })
      clients.push(client)
      await client.bootstrapPromise
      await delay(1000)
    }
  })
  it('wait for 0 friends to be connecting', (done) => {

    async function logStatusPojos() {
      const statusPojos = await Promise.all(clients.map(async (client, index) => {
        return client.fetchStatusPojo()
      }))
      fs.writeFileSync('statusPojos.json', JSON.stringify(statusPojos, null, 2))
    }

    async function getIsFullyConnected() {
      let isFullyConnected = true
      await Promise.all(clients.map(async (client, index) => {
        const statusPojo = await client.fetchStatusPojo()
        const friends = statusPojo.extroverts.concat(statusPojo.introverts)
        if (friends.length !== params.friendsCount) {
          isFullyConnected = false
          return
        }
        friends.forEach((friend) => {
          if (friend.status !== 2) {
            isFullyConnected = false
          }
        })
      }))
      return isFullyConnected
    }

    async function onFriendStatus() {
      await logStatusPojos()

      if (await getIsFullyConnected()) {
        clearInterval(logStatusPojosInterval)
        done()
      }
    }


    getIsFullyConnected().then((isFullyConnected) => {
      if (isFullyConnected) {
        done()
        return
      }
      logStatusPojosInterval = setInterval(logStatusPojos, 1000)
      clients.forEach((client, index) => {
        client.on('friend.status', onFriendStatus)
      })
    })


  })
})
