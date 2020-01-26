import { Client } from './Client'
import { Uu } from 'pollenium-uvaursi'
import { Uint256 } from 'pollenium-buttercup'
import { Missive } from './Missive'
import { genNow } from '../utils'
import { SimplePeer } from 'simple-peer'
import { Snowdrop } from 'pollenium-snowdrop'

export enum FRIENDSHIP_STATUS {
  DEFAULT = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  DESTROYED = 3,
}

export class Friendship {

  status: FRIENDSHIP_STATUS = FRIENDSHIP_STATUS.DEFAULT;

  peerClientNonce: Uu;

  createdAt: number;

  readonly statusSnowdrop: Snowdrop<Friendship> = new Snowdrop<Friendship>()

  constructor(public client: Client, public simplePeer: SimplePeer) {
    this.createdAt = genNow()
    this.setSimplePeerListeners()
  }

  setStatus(status: FRIENDSHIP_STATUS): void {
    if (this.status !== undefined && status <= this.status) {
      throw new Error('Can only increase status')
    }
    this.status = status
    if (this.peerClientNonce) {
      this.client.setFriendshipStatusByClientNonce(this.peerClientNonce, status)
    }
    this.statusSnowdrop.emitIfHandle(this)
    this.client.friendshipStatusSnowdrop.emitIfHandle(this)
  }

  getDistance(): Uint256 {
    if (this.peerClientNonce === undefined) {
      throw new Error('peerClientNonce not yet established')
    }
    return new Uint256(this.peerClientNonce.genXor(this.client.nonce))
  }

  private setSimplePeerListeners(): void {
    this.simplePeer.on('iceStateChange', (iceConnectionState) => {
      if (iceConnectionState === 'disconnected') {
        this.destroy()
      }
    })

    this.simplePeer.on('connect', () => {
      this.setStatus(FRIENDSHIP_STATUS.CONNECTED)
    })
    this.simplePeer.on('data', (missiveEncodingBuffer: Buffer) => {
      const missive = Missive.fromEncoding(this.client, Uu.wrap(missiveEncodingBuffer))
      this.handleMessage(missive)
    })

    this.simplePeer.once('error', () => {
      this.destroy()
    })
    this.simplePeer.once('close', () => {
      this.destroy()
    })
  }

  destroy(): void {
    if (this.simplePeer) {
      this.destroySimplePeer()
    }
    this.setStatus(FRIENDSHIP_STATUS.DESTROYED)
    this.client.createFriendship()
  }

  destroySimplePeer(): void {
    this.simplePeer.removeAllListeners()
    this.simplePeer.destroy()
  }

  getIsSendable(): boolean {
    if (this.status !== FRIENDSHIP_STATUS.CONNECTED) {
      return false
    }
    if (!this.simplePeer.connected) {
      return false
    }
    return true
  }

  send(bytes: Uu): void {
    if (!this.getIsSendable()) {
      throw new Error('friendship not sendable')
    }
    this.simplePeer.send(bytes.unwrap())
  }

  sendMessage(missive: Missive): void {
    this.send(missive.getEncoding())
  }

  handleMessage(missive: Missive): void {
    if (missive.getIsReceived()) {
      return
    }

    missive.markIsReceived()
    this.client.missiveSnowdrop.emitIfHandle(missive)
    this.client.getFriendships().forEach((friendship) => {
      if (friendship === this) {
        return
      }
      if (!friendship.getIsSendable()) {
        return
      }
      friendship.sendMessage(missive)
    })
  }

}
