import { Client } from './Client'
import { Uint8, Uintable, Bytes32, Uint40 } from 'pollenium-buttercup'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Missive, MISSIVE_COVER } from './Missive'
import { genTimestamp, genNow } from '../utils'
import { missiveTemplate, MISSIVE_KEY } from '../templates/missive'
import { HashcashRequest } from '../interfaces/HashcashRequest'
import { HashcashResolution, HASHCASH_RESOLUTION_KEY } from '../interfaces/HashcashResolution'

const nullNonce = (new Uint8Array(32)).fill(0)

export class MissiveGenerator {

  missivePromise: Promise<Missive>

  worker: Worker;

  applicationId: Uu;

  applicationData: Uu;

  difficulty: Uint8;

  constructor(public client: Client, struct: {
    applicationId: Uish,
    applicationData: Uish,
    difficulty: Uintable
  }) {
    this.applicationId = Uu.wrap(struct.applicationId)
    this.applicationData = Uu.wrap(struct.applicationData)
    this.difficulty = Uint8.fromUintable(struct.difficulty)
  }

  private getNoncelessPrehash(timestamp: Uintable): Uu {
    const encoding = missiveTemplate.encode({
      key: MISSIVE_KEY.V0,
      value: {
        nonce: nullNonce,
        difficulty: this.difficulty.u,
        timestamp: Uint40.fromUintable(timestamp).u,
        applicationId: this.applicationId.u,
        applicationData: this.applicationData.u
      }
    })
    return new Uu(encoding.slice(0, encoding.length - 32))
  }

  private fetchNonce(timestamp: Uintable): Promise<Bytes32> {
    return new Promise((resolve, reject): void => {

      const worker = new this.client.options.Worker(this.client.options.hashcashWorkerUrl, [], {esm: true})

      const onMessage = async (event: any): Promise<void> => {
        worker.terminate()
        const hashcashResolution: HashcashResolution = event.data
        switch(hashcashResolution.key) {
          case HASHCASH_RESOLUTION_KEY.NONCE_HEX:
            resolve(new Bytes32(Uu.fromHexish(hashcashResolution.value)))
            break;
          case HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR:
            resolve(await this.fetchNonce(timestamp))
            break;
          default:
            throw new Error('Unhandled HASHCASH_RESOLUTION_KEY')
        }
      }

      worker.addEventListener('message', onMessage)
      worker.onerror = (error: ErrorEvent): void => {
        // worker.removeEventListener('message', onMessage)
        reject(error)
      }

      const timeoutAt = genNow() + 5
      const noncelessPrehash = this.getNoncelessPrehash(timestamp)
      const hashcashRequest: HashcashRequest = {
        noncelessPrehash,
        difficulty: this.difficulty,
        cover: MISSIVE_COVER.V0,
        applicationDataLength: this.applicationData.u.length,
        timeoutAt
      }
      worker.postMessage(hashcashRequest)
    })

  }

  async fetchMissive(): Promise<Missive> {
    const timestamp = genTimestamp()
    const nonce = await this.fetchNonce(timestamp)
    return new Missive(
      this.client,
      {
        version: MISSIVE_KEY.V0,
        timestamp,
        difficulty: this.difficulty,
        nonce,
        applicationId: this.applicationId,
        applicationData: this.applicationData
      }
    )
  }


}
