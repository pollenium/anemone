const stubs = require('./stubs')
const Bytes = require('../js/classes/Bytes').Bytes
const FriendMessageGenerator = require('../js/classes/FriendMessageGenerator').FriendMessageGenerator
const FriendMessage = require('../js/classes/FriendMessage').FriendMessage
const params = require('./params')

const friendMessages = []
const expectedReceivalsCount = params.friendMessagesCount * (params.clientsCount - 1)

require('./clients')

describe('friend messages', () => {
  let clients

  before(async () => {
    clients = await stubs.clients.promise
  })
  it('should have clients', () => {
    clients.length.should.equal(7)
  })
  for (let i = 0; i < params.friendMessagesCount; i++) {
    it(`should create friendMessages #${i}`, async () => {
      const client = clients[Math.floor(Math.random() * clients.length)]
      const friendMessageGenerator = new FriendMessageGenerator(
        client,
        Bytes.random(32),
        Bytes.random(32),
        6
      )
      const friendMessage = await friendMessageGenerator.fetchFriendMessage()
      friendMessages.push(friendMessage)
    })
  }
  it(`should send message and be received ${expectedReceivalsCount} times`, (done) => {
    let i = 0
    clients.forEach((client) => {
      client.on('friend.message', (_friendMessage) => {
        i++
        if (i === expectedReceivalsCount) {
          setTimeout(() => {
            if (i === expectedReceivalsCount) {
              done()
            } else {
              done(`Received ${i} times`)
            }
          }, 2000)
        }
      })
    })
    friendMessages.forEach((friendMessage) => {
      friendMessage.broadcast()
    })

  })
})
