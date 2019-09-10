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

require('./servers')

describe('clients', () => {

  const clients = []
  let signalingServers

  before(async() => {
    signalingServers = await stubs.signalingServers
  })

  after(() => {
    stubs.clients.resolve(clients)
  })

  it(`should create ${params.clientsCount} clients`, async () => {
    for (let i = 0; i < params.clientsCount; i++) {
      const client = new Client({
        signalingServerUrls: params.signalingServerPorts.map((port) => {
          return `ws://localhost:${port}`
        }),
        friendsMax: params.friendsCount,
        Worker: Worker
      })
      clients.push(client)
      await client.bootstrapPromise
      await delay(500)
    }
  })
  it('wait for 0 friends to be connecting', (done) => {

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
      if (await getIsFullyConnected()) {
        done()
      }
    }


    getIsFullyConnected().then((isFullyConnected) => {
      if (isFullyConnected) {
        done()
        return
      }
      clients.forEach((client, index) => {
        client.on('friend.status', onFriendStatus)
      })
    })


  })
})
