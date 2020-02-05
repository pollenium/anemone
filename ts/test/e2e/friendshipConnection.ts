import { Uu } from 'pollenium-uvaursi'
import { Primrose } from 'pollenium-primrose'
import { describe, it } from 'mocha'
import { Introvert } from '../../classes/Friendship/Introvert'
import { Extrovert } from '../../classes/Friendship/Extrovert'
import { Offer } from '../../classes/Signal/Offer'
import { Answer } from '../../classes/Signal/Answer'
import { FRIENDSHIP_STATUS, DESTROY_REASON } from '../../classes/Friendship'
import { MissiveGenerator } from '../../classes/MissiveGenerator'
import { Missive } from '../../classes/Missive'

const clientId = Uu.genRandom(32)
const struct = {
  missiveLatencyTolerance: 30,
  sdpTimeout: 30,
  connectionTimeout: 10,
}

let extrovert: Extrovert
let introvert: Introvert
let offer: Offer
let answer: Answer
let missive: Missive

describe('friendshipConnection', () => {
  it(' should create extrovert', () => {
    extrovert = new Extrovert(struct)
  })

  it('should create offer', async () => {
    offer = new Offer({
      id: Uu.genRandom(32),
      clientId,
      sdpb: await extrovert.fetchSdpb(),
    })
  }).timeout(10 * 1000)

  it('should create introvert', () => {
    introvert = new Introvert(offer, struct)
  })

  it('should create answer', async () => {
    answer = new Answer({
      clientId,
      offerId: offer.id,
      sdpb: await introvert.fetchSdpb(),
    })
  }).timeout(10 * 1000)

  it('should connect', () => {
    const connectionPrimrose = new Primrose<void>()

    extrovert.statusSnowdrop.addHandle((signal) => {
      if (signal === FRIENDSHIP_STATUS.CONNECTED) {
        connectionPrimrose.resolve()
      }
    })

    extrovert.handleAnswer(answer)

    return connectionPrimrose.promise
  }).timeout(30 * 1000)

  it('should create missive', async () => {
    const missiveGenerator = new MissiveGenerator({
      applicationId: Uu.genRandom(32),
      applicationData: Uu.genRandom(32),
      ttl: 30,
      difficulty: 4,
      hashcashWorkerUrl: `${__dirname}/../../../node/hashcash-worker.js`,
    })
    missive = await missiveGenerator.fetchMissive()
  }).timeout(20 * 1000)

  it('should send and receive missive', async () => {
    const testPrimrose = new Primrose<void>()

    introvert.missiveSnowdrop.addHandle((_missive) => {
      if (missive.getHash().uu.getIsEqual(_missive.getHash().uu)) {
        testPrimrose.resolve()
      } else {
        testPrimrose.reject('Missive mismatch')
      }
    })

    extrovert.sendMissive(missive)

    await testPrimrose.promise
  }).timeout(30 * 1000)

  it('should destroy', () => {
    introvert.destroy(DESTROY_REASON.GOODBYE)
    extrovert.destroy(DESTROY_REASON.GOODBYE)
  })
})
