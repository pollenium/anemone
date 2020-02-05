import {
  Uint8, Uintable, Bytes32,
} from 'pollenium-buttercup'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Primrose } from 'pollenium-primrose'
import Worker from 'tiny-worker'
import { Missive, MISSIVE_COVER } from './Missive'
import { genTimestamp } from '../utils/genTimestamp'
import { genTime } from '../utils/genTime'
import { TimeoutError } from '../utils/genNonce'
import { missiveTemplate, MISSIVE_KEY } from '../templates/missive'
import {
  HashcashWorkerRequest,
  HashcashWorkerResolution,
  HASHCASH_WORKER_RESOLUTION_KEY,
} from '../interfaces/HashcashWorker'

const nullNonce = new Uint8Array(32).fill(0)

export class MissiveGenerator {

  missivePromise: Promise<Missive>;
  applicationId: Uu;
  applicationData: Uu;
  difficulty: Uint8;
  ttl: number;
  hashcashWorkerUrl: string;

  constructor(struct: {
    applicationId: Uish;
    applicationData: Uish;
    difficulty: Uintable;
    ttl: number;
    hashcashWorkerUrl: string;
  }) {
    this.applicationId = Uu.wrap(struct.applicationId)
    this.applicationData = Uu.wrap(struct.applicationData)
    this.difficulty = Uint8.fromUintable(struct.difficulty)
    this.ttl = struct.ttl
    this.hashcashWorkerUrl = struct.hashcashWorkerUrl
  }

  private getNoncelessPrehash(): Uu {
    const encoding = missiveTemplate.encode({
      key: MISSIVE_KEY.V0,
      value: {
        nonce: nullNonce,
        difficulty: this.difficulty.u,
        timestamp: genTimestamp().u,
        applicationId: this.applicationId.u,
        applicationData: this.applicationData.u,
      },
    })
    return new Uu(encoding.slice(0, encoding.length - 32))
  }

  private fetchNonce(): Promise<Bytes32> {
    const noncePrimrose = new Primrose<Bytes32>()
    const hashcashWorker = new Worker(this.hashcashWorkerUrl, [], { esm: true })

    const onMessage = async (event: { data: HashcashWorkerResolution; }): Promise<void> => {
      hashcashWorker.terminate()
      const hashcashResolution = event.data
      switch (hashcashResolution.key) {
        case HASHCASH_WORKER_RESOLUTION_KEY.SUCCESS:
          noncePrimrose.resolve(new Bytes32(Uu.fromHexish(hashcashResolution.value)))
          break
        case HASHCASH_WORKER_RESOLUTION_KEY.TIMEOUT_ERROR:
          noncePrimrose.reject(new TimeoutError())
          break
        case HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR:
          noncePrimrose.reject(new Error('Generic Errror '))
          break
        default:
          noncePrimrose.reject(Error('Unhandled HASHCASH_WORKER_RESOLUTION_KEY'))
      }
    }

    hashcashWorker.addEventListener('message', onMessage)
    hashcashWorker.onerror = (error: ErrorEvent): void => {
      noncePrimrose.reject(error)
    }

    const timeoutAt = genTime() + this.ttl
    const request: HashcashWorkerRequest = {
      noncelessPrehashHex: this.getNoncelessPrehash().toHex(),
      difficulty: this.difficulty.toNumber(),
      cover: MISSIVE_COVER.V0,
      applicationDataLength: this.applicationData.u.length,
      timeoutAt,
    }
    hashcashWorker.postMessage(request)

    return noncePrimrose.promise
  }

  async fetchMissive(): Promise<Missive> {
    const timestamp = genTimestamp()
    const nonce = await this.fetchNonce()
    return new Missive({
      version: MISSIVE_KEY.V0,
      timestamp,
      difficulty: this.difficulty,
      nonce,
      applicationId: this.applicationId,
      applicationData: this.applicationData,
    })
  }

}
