const utils = require('../utils')

let client

describe('missiveGenerator', () => {

  it('should create client', () => {
    client = new utils.pollenium.Client({
      signalingServerUrls: [],
      friendshipsMax: 0,
      Worker: utils.Worker,
      hashcashWorkerUrl: utils.hashcashWorkerUrl
    })
  })

  for (let difficulty = 0; difficulty <= 6; difficulty++) {
    let missive
    it(`should generate missive with difficulty ${difficulty}`, async () => {
      const applicationId = utils.pollenium.Buttercup.random(32)
      const applicationData = utils.pollenium.Buttercup.random(64)
      const missiveGenerator = new utils.pollenium.MissiveGenerator(client, applicationId, applicationData, difficulty)
      missive = await missiveGenerator.fetchMissive()
    })
    it('should be valid', () => {
      missive.getIsValid().should.equal(true)
    })
  }

})