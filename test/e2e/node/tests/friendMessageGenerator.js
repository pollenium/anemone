const utils = require('../utils')

let client

describe('friendMessageGenerator', () => {

  it('should create client', () => {
    client = new utils.pollenium.Client({
      signalingServerUrls: [],
      friendsMax: 0,
      Worker: utils.Worker,
      hashcashWorkerUrl: utils.hashcashWorkerUrl
    })
  })

  for (let difficulty = 0; difficulty <= 6; difficulty++) {
    let friendMessage
    it(`should generate friend message with difficulty ${difficulty}`, async () => {
      const applicationId = utils.pollenium.Bytes.random(32)
      const applicationData = utils.pollenium.Bytes.random(64)
      const friendMessageGenerator = new utils.pollenium.FriendMessageGenerator(client, applicationId, applicationData, difficulty)
      friendMessage = await friendMessageGenerator.fetchFriendMessage()
    })
    it('should be valid', () => {
      friendMessage.getIsValid().should.equal(true)
    })
  }

})
