import { Uu } from 'pollenium-uvaursi'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { MissiveGenerator } from '../../classes/MissiveGenerator'
import { Missive } from '../../classes/Missive'

describe('MissiveGenerator', () => {
  for (let difficulty = 0; difficulty <= 13; difficulty++) {
    describe(`difficulty ${difficulty}`, async () => {
      let missiveGenerator: MissiveGenerator
      let missive: Missive
      it('should create missiveGenerator', () => {
        const applicationId = Uu.genRandom(32)
        const applicationData = Uu.genRandom(64)
        missiveGenerator = new MissiveGenerator({
          applicationId,
          applicationData,
          difficulty,
          ttl: 60,
          hashcashWorkerUrl: `${__dirname}/../../../node/hashcash-worker.js`,
        })
      })
      it('should fetch missive', async () => {
        missive = await missiveGenerator.fetchMissive()
      }).timeout(60 * 1000)
      it('missive should be valid', () => {
        expect(missive.getIsValid()).to.equal(true)
      })
    })
  }
})
