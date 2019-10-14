import { Client } from './Client'
import { Bytes } from './Bytes'
import EventEmitter from 'events'
import { Missive } from './Missive'
import { getNow } from '../utils'
import { SimplePeer } from 'simple-peer'

export enum FRIENDSHIP_STATUS {
  DEFAULT = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  DESTROYED = 3,
}

export class Friendship extends EventEmitter {

  status: FRIENDSHIP_STATUS = FRIENDSHIP_STATUS.DEFAULT;

  peerClientNonce: Bytes;

  createdAt: number;

  constructor(public client: Client, public simplePeer: SimplePeer) {
    super()
    this.createdAt = getNow()
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
    this.emit('status', status)
    this.client.emit('friendship.status', {
      friendship: this,
      status: this.status
    })
  }

  getDistance(): Bytes {
    if (this.peerClientNonce === undefined) {
      throw new Error('peerClientNonce not yet established')
    }
    return this.peerClientNonce.getXor(this.client.nonce)
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
      const missive = Missive.fromEncoding(this.client, Bytes.fromBuffer(missiveEncodingBuffer))
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
    setTimeout(() => {
      // keep async so that client can listen for destroy event
      this.removeAllListeners()
    })
    this.client.createFriendship()
  }

  destroySimplePeer(): void {
    this.simplePeer.removeAllListeners()
    this.simplePeer.destroy()
  }

  send(bytes: Bytes): void {
    if (this.status !== FRIENDSHIP_STATUS.CONNECTED) {
      throw new Error('Cannot send unless FRIENDSHIP_STATUS.CONNECTED')
    }
    this.simplePeer.send(bytes.uint8Array)
  }

  sendMessage(missive: Missive): void {
    this.send(missive.getEncoding())
  }

  handleMessage(missive: Missive): void {
    if (missive.getIsReceived()) {
      return
    }

    missive.markIsReceived()
    this.client.emit('friendship.missive', missive)
    this.client.getFriendships().forEach((friendship) => {
      if (friendship === this) {
        return
      }
      if (friendship.status !== FRIENDSHIP_STATUS.CONNECTED) {
        return
      }
      friendship.sendMessage(missive)
    })
  }

}
