import { Uintable, Uint40, Uint256, Uint8, Bytes32 } from 'pollenium-buttercup'
import { Uu, Uish } from 'pollenium-uvaursi'
import { MISSIVE_KEY, missiveTemplate } from '../templates/missive'
import { genTimestamp, genEra, genMaxHash } from '../utils'
import { Client } from './Client'
import * as shasta from 'pollenium-shasta'

export enum MISSIVE_COVER {
  V0 = 69
}

export class Missive {

  public cover: MISSIVE_COVER;

  public version: MISSIVE_KEY;

  public timestamp: Uint40;

  public difficulty: Uint8;

  public nonce: Uu;

  public applicationId: Bytes32;

  public applicationData: Uu;

  constructor(
    public client: Client,
    struct: {
      version: MISSIVE_KEY,
      nonce: Uish,
      applicationId: Uish,
      applicationData: Uish,
      timestamp: Uintable,
      difficulty: Uintable
    }
  ) {
    this.cover = MISSIVE_COVER.V0
    this.version = struct.version
    this.nonce = Uu.wrap(struct.nonce)
    this.applicationId = new Bytes32(struct.applicationId)
    this.applicationData = Uu.wrap(struct.applicationData)
    this.timestamp = Uint40.fromUintable(struct.timestamp)
    this.difficulty = Uint8.fromUintable(struct.difficulty)

  }

  getEncoding(): Uu {
    return Uu.wrap(
      missiveTemplate.encode({
        key: MISSIVE_KEY.V0,
        value: {
          timestamp: this.timestamp.u,
          difficulty: this.difficulty.u,
          applicationId: this.applicationId.u,
          nonce: this.nonce.u,
          applicationData: this.applicationData.u
        }
      })
    )
  }

  getId(): Uint256 {
    return this.getHash()
  }

  getHash(): Uint256 {
    return new Uint256(shasta.genSha256(this.getEncoding().unwrap()))
  }

  getEra(): number {
    return genEra(this.timestamp.toNumber())
  }

  getIsReceived(): boolean {
    const era = this.getEra()
    const idHex = this.getId().uu.toHex()
    if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
      return false
    }
    return this.client.missiveIsReceivedByIdHexByEra[era][idHex] === true
  }

  markIsReceived(): void {
    const era = this.getEra()
    const idHex = this.getId().uu.toHex()
    if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
      this.client.missiveIsReceivedByIdHexByEra[era] = {}
    }
    this.client.missiveIsReceivedByIdHexByEra[era][idHex] = true
  }

  getMaxHash(): Uint256 {
    return genMaxHash({
      difficulty: this.difficulty,
      cover: this.cover,
      applicationDataLength: this.applicationData.u.length
    })
  }

  getIsValid(): boolean {
    if (this.version !== MISSIVE_KEY.V0) {
      return false
    }
    const timestamp = genTimestamp()
    if (this.timestamp.compLt(timestamp.opSub(this.client.options.missiveLatencyTolerance))) {
      return false
    }
    if (this.timestamp.compGt(timestamp)) {
      return false
    }
    if (this.getIsReceived()) {
      return false
    }
    if (this.getHash().compGt(this.getMaxHash())) {
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
          {
            version: henpojo.key,
            timestamp: new Uint40(v0Henpojo.timestamp),
            difficulty: v0Henpojo.difficulty[0],
            nonce: v0Henpojo.nonce,
            applicationId: v0Henpojo.applicationId,
            applicationData: v0Henpojo.applicationData
          }
        )
      }
      default:
        throw new Error('Unhandled MISSIVE_KEY')
    }
  }

  static fromEncoding(client: Client, encoding: Uish): Missive {
    return Missive.fromHenpojo(client, missiveTemplate.decode(Uu.wrap(encoding).unwrap()))
  }

}
