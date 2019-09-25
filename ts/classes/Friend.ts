import { Client } from './Client'
import { Bytes } from './Bytes'
import EventEmitter from 'events'
import { FriendMessage } from './FriendMessage'
import { getNow } from '../utils'
import { SimplePeer } from 'simple-peer'

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

  setStatus(status: FRIEND_STATUS): void {
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

  private setSimplePeerListeners(): void {
    this.simplePeer.on('iceStateChange', (iceConnectionState) => {
      if (iceConnectionState === 'disconnected') {
        this.destroy()
      }
    })

    this.simplePeer.on('connect', () => {
      this.setStatus(FRIEND_STATUS.CONNECTED)
    })
    this.simplePeer.on('data', (friendMessageEncodingBuffer: Buffer) => {
      const friendMessage = FriendMessage.fromEncoding(this.client, Bytes.fromBuffer(friendMessageEncodingBuffer))
      this.handleMessage(friendMessage)
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
    this.setStatus(FRIEND_STATUS.DESTROYED)
    setTimeout(() => {
      // keep async so that client can listen for destroy event
      this.removeAllListeners()
    })
    this.client.createFriend()
  }

  destroySimplePeer(): void {
    this.simplePeer.removeAllListeners()
    this.simplePeer.destroy()
  }

  send(bytes: Bytes): void {
    if (this.status !== FRIEND_STATUS.CONNECTED) {
      throw new Error('Cannot send unless FRIEND_STATUS.CONNECTED')
    }
    this.simplePeer.send(bytes.uint8Array)
  }

  sendMessage(friendMessage: FriendMessage): void {
    this.send(friendMessage.getEncoding())
  }

  handleMessage(friendMessage: FriendMessage): void {
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
