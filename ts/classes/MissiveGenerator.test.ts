import { Uu } from 'pollenium-uvaursi'
import { MissiveGenerator } from './MissiveGenerator'
import { Client } from './Client'
import TinyWorker from 'tiny-worker'

let client

for (let i = 0; i <= 13; i++) {
  const difficulty = i * 1
  test(`generate missive with difficulty ${difficulty}`, async () => {
    const applicationId = Uu.genRandom(32)
    const applicationData = Uu.genRandom(64)
    const missiveGenerator = new MissiveGenerator({
      applicationId,
      applicationData,
      difficulty,
      ttl: 60,
      hashcashWorker:new TinyWorker(`${__dirname}/../../node/hashcash-worker.js`, [], { esm: true })
    })
    const missive = await missiveGenerator.fetchMissive()
    expect(missive.getIsValid()).toBe(true)
  }, 60000)
}
