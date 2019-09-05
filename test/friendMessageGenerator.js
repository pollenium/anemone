const Client = require('../js/classes/Client').Client
const FriendMessageGenerator = require('../js/classes/FriendMessageGenerator').FriendMessageGenerator
const Bytes = require('../js/classes/Bytes').Bytes
const Worker = require('tiny-worker')

let client

describe('FriendMessageGenerator', () => {

  it('should create client', () => {
    client = new Client({
      signalingServerUrls: [],
      friendsMax: 0,
      Worker
    })
  })

  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    let friendMessage
    it(`should generate friend message with difficulty ${difficulty}`, async () => {
      const applicationId = Bytes.random(32)
      const applicationData = Bytes.random(64)
      const friendMessageGenerator = new FriendMessageGenerator(client, applicationId, applicationData, difficulty)
      friendMessage = await friendMessageGenerator.fetchFriendMessage()
    })
    it('should be valid', () => {
      friendMessage.getIsValid().should.equal(true)
    })
  }

})
