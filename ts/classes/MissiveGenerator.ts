import { Client } from './Client'
import { Bytes } from './Bytes'
import { Missive, MISSIVE_COVER } from './Missive'
import { getTimestamp, getNow } from '../utils'
import { missiveTemplate, MISSIVE_KEY } from '../templates/missive'
import { HashcashRequest } from '../interfaces/HashcashRequest'
import { HashcashResolution, HASHCASH_RESOLUTION_KEY } from '../interfaces/HashcashResolution'

const nullNonce = (new Uint8Array(32)).fill(0)

export class MissiveGenerator {

  missivePromise: Promise<Missive>

  worker: Worker;

  constructor(public client: Client, public applicationId: Bytes, public applicationData: Bytes, public difficulty: number) {
  }

  private getNoncelessPrehash(timestamp: Bytes): Bytes {
    const encoding = missiveTemplate.encode({
      key: MISSIVE_KEY.V0,
      value: {
        nonce: nullNonce,
        difficulty: new Uint8Array([this.difficulty]),
        timestamp: timestamp.uint8Array,
        applicationId: this.applicationId.uint8Array,
        applicationData: this.applicationData.uint8Array
      }
    })
    return new Bytes(encoding.slice(0, encoding.length - 32))
  }

  private fetchNonce(timestamp: Bytes): Promise<Bytes> {
    return new Promise((resolve, reject): void => {

      const worker = new this.client.options.Worker(this.client.options.hashcashWorkerUrl, [], {esm: true})

      const onMessage = async (event: any): Promise<void> => {
        worker.terminate()
        const hashcashResolution: HashcashResolution = event.data
        switch(hashcashResolution.key) {
          case HASHCASH_RESOLUTION_KEY.NONCE_HEX:
            resolve(Bytes.fromHex(hashcashResolution.value))
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

      const timeoutAt = getNow() + 5
      const noncelessPrehash = this.getNoncelessPrehash(timestamp)
      const hashcashRequest: HashcashRequest = {
        noncelessPrehashHex: noncelessPrehash.getHex(),
        difficulty: this.difficulty,
        cover: MISSIVE_COVER.V0,
        applicationDataLength: this.applicationData.getLength(),
        timeoutAt
      }
      worker.postMessage(hashcashRequest)
    })

  }

  async fetchMissive(): Promise<Missive> {
    const timestamp = getTimestamp()
    const nonce = await this.fetchNonce(timestamp)
    return new Missive(
      this.client,
      MISSIVE_KEY.V0,
      timestamp,
      this.difficulty,
      nonce,
      this.applicationId,
      this.applicationData
    )
  }


}
