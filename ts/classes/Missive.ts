import { Bytes } from './Bytes'
import { MISSIVE_KEY, missiveTemplate } from '../templates/missive'
import { getNow, calculateEra, getMaxHash } from '../utils'
import { Client } from './Client'
import Bn from 'bn.js'

export enum MISSIVE_COVER {
  V0 = 69
}

export class Missive {

  public cover: MISSIVE_COVER;

  constructor(
    public client: Client,
    public version: MISSIVE_KEY,
    public timestamp: Bytes,
    public difficulty: number,
    public nonce: Bytes,
    public applicationId: Bytes,
    public applicationData: Bytes
  ) {
    this.cover = MISSIVE_COVER.V0
  }

  getEncoding(): Bytes {
    return new Bytes(
      missiveTemplate.encode({
        key: MISSIVE_KEY.V0,
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
    if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
      return false
    }
    return this.client.missiveIsReceivedByIdHexByEra[era][idHex] === true
  }

  markIsReceived(): void {
    const era = this.getEra()
    const idHex = this.getId().getHex()
    if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
      this.client.missiveIsReceivedByIdHexByEra[era] = {}
    }
    this.client.missiveIsReceivedByIdHexByEra[era][idHex] = true
  }

  getMaxHash(): Bytes {
    return getMaxHash(this.difficulty, this.cover, this.applicationData.getLength())
  }

  getIsValid(): boolean {
    if (this.version !== MISSIVE_KEY.V0) {
      return false
    }
    const now = getNow()
    const nowBn = new Bn(now)
    const timestampBn = this.timestamp.getBn()
    if (timestampBn.lt(nowBn.sub(this.client.missiveLatencyToleranceBn))) {
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
    this.client.getFriendships().forEach((friendship) => {
      if (!friendship.getIsSendable()) {
        return
      }
      friendship.send(this.getEncoding())
    })
  }

  static fromHenpojo(client: Client, henpojo: any): Missive {
    switch (henpojo.key) {
      case MISSIVE_KEY.V0: {
        const v0Henpojo = henpojo.value
        return new Missive(
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
        throw new Error('Unhandled MISSIVE_KEY')
    }
  }

  static fromEncoding(client: Client, encoding: Bytes): Missive {
    return Missive.fromHenpojo(client, missiveTemplate.decode(encoding.uint8Array))
  }

}
