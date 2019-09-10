import { Client } from './Client'
import { Bytes } from './Bytes'
import { FriendMessage } from './FriendMessage'
import { getTimestamp, getNow } from '../utils'
import { friendMessageTemplate, FRIEND_MESSAGE_KEY } from '../templates/friendMessage'
import { HashcashRequest } from '../interfaces/HashcashRequest'
import { HashcashResolution, HASHCASH_RESOLUTION_KEY } from '../interfaces/HashcashResolution'

const nullNonce = (new Uint8Array(32)).fill(0)

export class FriendMessageGenerator {

  friendMessagePromise: Promise<FriendMessage>

  worker: Worker;

  constructor(public client: Client, public applicationId: Bytes, public applicationData: Bytes, public difficulty: number) {
  }

  private getNoncelessPrehash(timestamp: Bytes): Bytes {
    const encoding = friendMessageTemplate.encode({
      key: FRIEND_MESSAGE_KEY.V0,
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

      const worker = new this.client.options.Worker(`${__dirname}/../../hashcash.js`)

      const onMessage = async (event: any): Promise<void> => {
        worker.terminate()
        const hashcashResolution: HashcashResolution = event.data
        // worker.removeEventListener('message', onMessage)
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
        timeoutAt
      }
      worker.postMessage(hashcashRequest)
    })

  }

  async fetchFriendMessage(): Promise<FriendMessage> {
    const timestamp = getTimestamp()
    const nonce = await this.fetchNonce(timestamp)
    return new FriendMessage(
      this.client,
      FRIEND_MESSAGE_KEY.V0,
      timestamp,
      this.difficulty,
      nonce,
      this.applicationId,
      this.applicationData
    )
  }


}
