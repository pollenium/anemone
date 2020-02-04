import { Client } from './Client'
import { Uint8, Uintable, Bytes32, Uint40 } from 'pollenium-buttercup'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Missive, MISSIVE_COVER } from './Missive'
import { genTimestamp } from '../utils/genTimestamp'
import { genTime } from '../utils/genTime'
import { TimeoutError } from '../utils/genNonce'
import { missiveTemplate, MISSIVE_KEY } from '../templates/missive'
import {
  HashcashWorkerRequest,
  HashcashWorkerResolution,
  HASHCASH_WORKER_RESOLUTION_KEY
} from '../interfaces/HashcashWorker'
import { Primrose } from 'pollenium-primrose'

const nullNonce = (new Uint8Array(32)).fill(0)

export class MissiveGenerator {

  missivePromise: Promise<Missive>
  applicationId: Uu;
  applicationData: Uu;
  difficulty: Uint8;
  ttl: number;
  hashcashWorker: Worker;

  constructor(struct: {
    applicationId: Uish,
    applicationData: Uish,
    difficulty: Uintable,
    ttl: number
    hashcashWorker: Worker;
  }) {
    this.applicationId = Uu.wrap(struct.applicationId)
    this.applicationData = Uu.wrap(struct.applicationData)
    this.difficulty = Uint8.fromUintable(struct.difficulty)
    this.ttl = struct.ttl
    this.hashcashWorker = struct.hashcashWorker
  }

  private getNoncelessPrehash(): Uu {
    const encoding = missiveTemplate.encode({
      key: MISSIVE_KEY.V0,
      value: {
        nonce: nullNonce,
        difficulty: this.difficulty.u,
        timestamp: genTimestamp().u,
        applicationId: this.applicationId.u,
        applicationData: this.applicationData.u
      }
    })
    return new Uu(encoding.slice(0, encoding.length - 32))
  }

  private fetchNonce(): Promise<Bytes32> {
    const noncePrimrose = new Primrose<Bytes32>()

    const onMessage = async (event: any): Promise<void> => {
      this.hashcashWorker.terminate()
      const hashcashResolution: HashcashWorkerResolution = event.data
      switch(hashcashResolution.key) {
        case HASHCASH_WORKER_RESOLUTION_KEY.SUCCESS:
          noncePrimrose.resolve(new Bytes32(Uu.fromHexish(hashcashResolution.value)))
          break;
        case HASHCASH_WORKER_RESOLUTION_KEY.TIMEOUT_ERROR:
          noncePrimrose.reject(new TimeoutError)
          break;
        case HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR:
          noncePrimrose.reject(new Error('Generic Errror '))
          break;
        default:
          noncePrimrose.reject(Error('Unhandled HASHCASH_WORKER_RESOLUTION_KEY'))
      }
    }

    this.hashcashWorker.addEventListener('message', onMessage)
    this.hashcashWorker.onerror = (error: ErrorEvent): void => {
      noncePrimrose.reject(error)
    }

    const timeoutAt = genTime() + this.ttl
    const noncelessPrehash = this.getNoncelessPrehash()
    const request: HashcashWorkerRequest = {
      noncelessPrehashHex: this.getNoncelessPrehash().toHex(),
      difficulty: this.difficulty.toNumber(),
      cover: MISSIVE_COVER.V0,
      applicationDataLength: this.applicationData.u.length,
      timeoutAt
    }
    this.hashcashWorker.postMessage(request)

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
      applicationData: this.applicationData
    })
  }


}
