import { Introvert } from '../classes/Friendship/Introvert'
import { Extrovert } from '../classes/Friendship/Extrovert'
import { Uu } from 'pollenium-uvaursi'
import { Offer } from '../classes/Signal/Offer'
import { Answer } from '../classes/Signal/Answer'
import { Primrose } from 'pollenium-primrose'
import { FRIENDSHIP_STATUS, DESTROY_REASON } from '../classes/Friendship'
import wrtc from 'wrtc'
import { MissiveGenerator } from '../classes/MissiveGenerator'
import { Missive } from '../classes/Missive'
import TinyWorker from 'tiny-worker'

const clientId = Uu.genRandom(32)
const options = {
  wrtc,
  missiveLatencyTolerance: 30,
  sdpTimeout: 5,
  connectionTimeout: 10
}

let extrovert: Extrovert
let introvert: Introvert
let offer: Offer
let answer: Answer
let missive: Missive

describe('friendshipConnection', () => {


  test('create extrovert', () => {
    extrovert = new Extrovert(options)
    extrovert.destroyedSnowdrop.addHandle(() => {})
  })

  test('create offer', async () => {
    offer = new Offer({
      id: Uu.genRandom(32),
      clientId,
      sdpb: await extrovert.fetchSdpb()
    })
  })

  test('create introvert', () => {
    introvert = new Introvert(offer, options)
    introvert.destroyedSnowdrop.addHandle(() => {})
  })

  test('create answer', async () => {
    answer = new Answer({
      clientId,
      offerId: offer.id,
      sdpb: await introvert.fetchSdpb()
    })
  })

  test('connect', () => {
    const connectionPrimrose = new Primrose<void>()

    extrovert.statusSnowdrop.addHandle((signal) => {
      if (signal === FRIENDSHIP_STATUS.CONNECTED) {
        connectionPrimrose.resolve()
      }
    })

    extrovert.handleAnswer(answer)

    return connectionPrimrose.promise
  }, 30000)

  test('create missive', async () => {
    const missiveGenerator = new MissiveGenerator({
      applicationId: Uu.genRandom(32),
      applicationData: Uu.genRandom(32),
      ttl: 30,
      difficulty: 4,
      hashcashWorker: new TinyWorker(`${__dirname}/../../node/hashcash-worker.js`, [], { esm: true })
    })
    missive = await missiveGenerator.fetchMissive()
  })

  test('send missive', async () => {
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
  }, 30000)

  test('destroy', () => {
    introvert.destroy(DESTROY_REASON.GOODBYE)
    extrovert.destroy(DESTROY_REASON.GOODBYE)
  })

})
