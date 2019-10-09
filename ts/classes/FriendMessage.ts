import { Bytes } from './Bytes'
import { FRIEND_STATUS } from './Friend'
import { FRIEND_MESSAGE_KEY, friendMessageTemplate } from '../templates/friendMessage'
import { getNow, calculateEra, getMaxHash } from '../utils'
import { Client } from './Client'
import Bn from 'bn.js'

export class FriendMessage {

  constructor(
    public client: Client,
    public version: FRIEND_MESSAGE_KEY,
    public timestamp: Bytes,
    public difficulty: number,
    public nonce: Bytes,
    public applicationId: Bytes,
    public applicationData: Bytes
  ) {}

  getEncoding(): Bytes {
    return new Bytes(
      friendMessageTemplate.encode({
        key: FRIEND_MESSAGE_KEY.V0,
        value: {
          timestamp: this.timestamp.uint8Array,
          difficulty: new Uint8Array([this.difficulty]),
          applicationId: this.applicationId.uint8Array,
          nonce: this.nonce.uint8Array,
          applicationData: this.applicationData.uint8Array
        }
      })
    )
  }

  getId(): Bytes {
    return this.getEncoding().getHash()
  }

  getEra(): number {
    return calculateEra(this.timestamp.getNumber())
  }

  getIsReceived(): boolean {
    const era = this.getEra()
    const idHex = this.getId().getHex()
    if (this.client.friendMessageIsReceivedByIdHexByEra[era] === undefined) {
      return false
    }
    return this.client.friendMessageIsReceivedByIdHexByEra[era][idHex] === true
  }

  markIsReceived(): void {
    const era = this.getEra()
    const idHex = this.getId().getHex()
    if (this.client.friendMessageIsReceivedByIdHexByEra[era] === undefined) {
      this.client.friendMessageIsReceivedByIdHexByEra[era] = {}
    }
    this.client.friendMessageIsReceivedByIdHexByEra[era][idHex] = true
  }

  getMaxHash(): Bytes {
    return getMaxHash(this.difficulty, this.getEncoding().getLength())
  }

  getIsValid(): boolean {
    if (this.version !== FRIEND_MESSAGE_KEY.V0) {
      return false
    }
    const now = getNow()
    const nowBn = new Bn(now)
    const timestampBn = this.timestamp.getBn()
    if (timestampBn.lt(nowBn.sub(this.client.friendMessageLatencyToleranceBn))) {
      return false
    }
    if (timestampBn.gt(nowBn)) {
      return false
    }
    if (this.getIsReceived()) {
      return false
    }
    if (this.getId().getBn().gt(this.getMaxHash().getBn())) {
      return false
    }
    return true
  }

  broadcast(): void {
    this.markIsReceived()
    this.client.getFriends().forEach((friend) => {
      if (friend.status !== FRIEND_STATUS.CONNECTED) {
        return
      }
      friend.send(this.getEncoding())
    })
  }

  static fromHenpojo(client: Client, henpojo: any): FriendMessage {
    switch (henpojo.key) {
      case FRIEND_MESSAGE_KEY.V0: {
        const v0Henpojo = henpojo.value
        return new FriendMessage(
          client,
          henpojo.key,
          new Bytes(v0Henpojo.timestamp),
          v0Henpojo.difficulty[0],
          new Bytes(v0Henpojo.nonce),
          new Bytes(v0Henpojo.applicationId),
          new Bytes(v0Henpojo.applicationData),
        )
      }
      default:
        throw new Error('Unhandled FRIEND_MESSAGE_KEY')
    }
  }

  static fromEncoding(client: Client, encoding: Bytes): FriendMessage {
    return FriendMessage.fromHenpojo(client, friendMessageTemplate.decode(encoding.uint8Array))
  }

}
