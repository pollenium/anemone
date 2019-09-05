import * as SimplePeer from 'simple-peer'
import * as wrtc from 'wrtc'
import { Client } from './Client'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import * as delay from 'delay'
import * as EventEmitter from 'events'
import { FriendMessage } from './FriendMessage'
import { getSimplePeerConfig, getNow } from '../utils'

export enum FRIEND_STATUS {
  DEFAULT = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  DESTROYED = 3,
}

export class Friend extends EventEmitter {
  status: FRIEND_STATUS = FRIEND_STATUS.DEFAULT;
  peerClientNonce: Bytes;
  createdAt: number;

  constructor(public client: Client, public simplePeer: SimplePeer) {
    super()
    this.createdAt = getNow()
    this.setSimplePeerListeners()
  }

  setStatus(status: FRIEND_STATUS) {
    if (this.status !== undefined && status <= this.status) {
      throw new Error('Can only increase status')
    }
    this.status = status
    if (this.peerClientNonce) {
      this.client.setFriendStatusByClientNonce(this.peerClientNonce, status)
    }
    this.emit('status', status)
    this.client.emit('friend.status', {
      friend: this,
      status: this.status
    })
  }

  private setSimplePeerListeners() {
    this.simplePeer.on('connect', () => {
      this.setStatus(FRIEND_STATUS.CONNECTED)
    })
    this.simplePeer.on('data', (friendMessageEncodingBuffer: Buffer) => {
      const friendMessage = FriendMessage.fromEncoding(this.client, Bytes.fromBuffer(friendMessageEncodingBuffer))
      this.handleMessage(friendMessage)
    })

    this.simplePeer.once('error', (error) => {
      this.destroy()
    })
    this.simplePeer.once('close', () => {
      this.destroy()
    })
  }

  destroy() {
    this.removeAllListeners()
    if (this.simplePeer) {
      this.destroySimplePeer()
    }
    this.setStatus(FRIEND_STATUS.DESTROYED)
    this.client.createFriend()
  }

  destroySimplePeer() {
    if (!this.simplePeer) {
      throw new Error('Cannot destory simplePeer, simplePeer not set')
    }
    this.simplePeer.removeAllListeners()
    this.simplePeer.destroy()
  }

  send(bytes: Bytes) {
    if (this.status !== FRIEND_STATUS.CONNECTED) {
      throw new Error('Cannot send unless FRIEND_STATUS.CONNECTED')
    }
    this.simplePeer.send(bytes.uint8Array)
  }

  sendMessage(friendMessage: FriendMessage) {
    this.send(friendMessage.getEncoding())
  }

  getStatusPojo() {
    return {
      createdAgo: (getNow() - this.createdAt),
      status: this.status,
      peerClientNonceHex: this.peerClientNonce ? this.peerClientNonce.getHex() : null
    }
  }

  handleMessage(friendMessage: FriendMessage) {
    if (friendMessage.getIsReceived()) {
      return
    }

    friendMessage.markIsReceived()
    this.client.emit('friend.message', friendMessage)
    this.client.getFriends().forEach((friend) => {
      if (friend !== this) {
        friend.sendMessage(friendMessage)
      }
    })
  }

}
