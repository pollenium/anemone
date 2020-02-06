import { Uu } from 'pollenium-uvaursi'
import { Bytes32 } from 'pollenium-buttercup'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { Snowdrop } from 'pollenium-snowdrop'
import { Primrose } from 'pollenium-primrose'
import delay from 'delay'
import wrtc from 'wrtc'
import { genSimplePeerConfig } from '../utils/genSimplePeerConfig'
import { genTime } from '../utils/genTime'
import { Missive } from './Missive'

export enum FRIENDSHIP_STATUS {
  DEFAULT = 0,
  CONNECTING = 1,
  CONNECTED = 2
}

export enum BAN_REASON {
  MISSIVE_OLD = 'MISSIVE_OLD',
  MISSIVE_TIMETRAVEL = 'MISSIVE_TIMETRAVEL',
  MISSIVE_INVALID = 'MISSIVE_INVALID',
  MISSIVE_DUPLICATE = 'MISSIVE_DUPLICATE',
  MISSIVE_NONDECODABLE = 'MISSIVE_NONDECODABLE'
}

export enum DESTROY_REASON {
  GOODBYE = 'GOODBYE',
  BAN = 'BAN',
  WRTC_CLOSE = 'WRTC_CLOSE',
  WRTC_ERROR = 'WRTC_ERROR',
  ICE_DISCONNECT = 'ICE_DISCONNECT',
  ICE_FAILED = 'ICE_FAILED',
  TOO_FAR = 'TOO_FAR',
  NEW_OFFER = 'NEW_OFFER',
  SDP_TIMEOUT = 'SDP_TIMEOUT',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT'
}

export interface FriendshipStruct {
  initiator: boolean;
  missiveLatencyTolerance?: number;
  sdpTimeout?: number;
  connectionTimeout?: number;
}

export abstract class Friendship {

  private status: FRIENDSHIP_STATUS = FRIENDSHIP_STATUS.DEFAULT;
  private peerClientId: Bytes32 | null = null;
  private isDestroyed: boolean = false;
  private sdpbPrimrose: Primrose<Uu> = new Primrose<Uu>();

  private simplePeer: SimplePeer;

  private isMissiveReceivedByHashHex: Record<string, boolean> = {};

  readonly destroyedSnowdrop: Snowdrop<DESTROY_REASON> = new Snowdrop<DESTROY_REASON>({ maxEmitsCount: 1 });
  readonly statusSnowdrop: Snowdrop<FRIENDSHIP_STATUS> = new Snowdrop<
    FRIENDSHIP_STATUS
  >();
  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();
  readonly banSnowdrop: Snowdrop<Bytes32> = new Snowdrop<Bytes32>();

  private banReason: BAN_REASON | null = null;
  private destroyReason: DESTROY_REASON | null = null;

  constructor(private struct: FriendshipStruct) {
    this.simplePeer = new SimplePeer({
      initiator: struct.initiator,
      trickle: false,
      config: genSimplePeerConfig(),
      wrtc,
    })

    this.simplePeer.on('iceStateChange', (iceConnectionState) => {
      if (iceConnectionState === 'failed') {
        this.destroy(DESTROY_REASON.ICE_FAILED)
      }
    })
    this.simplePeer.on('connect', () => {
      this.setStatus(FRIENDSHIP_STATUS.CONNECTED)
    })
    this.simplePeer.once('error', () => {
      this.destroy(DESTROY_REASON.WRTC_ERROR)
    })
    this.simplePeer.once('close', () => {
      this.destroy(DESTROY_REASON.WRTC_CLOSE)
    })
    this.simplePeer.once('signal', (signal: SimplePeerSignalData) => {
      if (this.isDestroyed) {
        return
      }
      this.sdpbPrimrose.resolve(Uu.fromUtf8(signal.sdp))
    })
    this.simplePeer.on('data', (data: Buffer) => {
      const encoding = new Uu(new Uint8Array(data))
      let missive: Missive
      try {
        missive = Missive.fromEncoding(encoding)
      } catch (error) {
        this.banAndDestroy(BAN_REASON.MISSIVE_NONDECODABLE)
      }
      if (this.getIsMissiveReceived(missive)) {
        this.banAndDestroy(BAN_REASON.MISSIVE_DUPLICATE)
      }
      if (!missive.getIsValid()) {
        this.banAndDestroy(BAN_REASON.MISSIVE_INVALID)
      }
      const time = genTime()
      if (missive.timestamp.toNumber() > time) {
        this.banAndDestroy(BAN_REASON.MISSIVE_TIMETRAVEL)
      }
      if (missive.timestamp.toNumber() < time - struct.missiveLatencyTolerance) {
        this.banAndDestroy(BAN_REASON.MISSIVE_OLD)
      }
      this.missiveSnowdrop.emit(missive)
    })

    let isSdpb = false

    this.fetchSdpb().then(() => {
      isSdpb = true
    })

    delay(struct.sdpTimeout * 1000).then(() => {
      if (this.isDestroyed) {
        return
      }
      if (isSdpb) {
        return
      }
      this.destroy(DESTROY_REASON.SDP_TIMEOUT)
    })
  }

  getPeerClientId(): Bytes32 | null {
    return this.peerClientId
  }

  getStatus(): FRIENDSHIP_STATUS {
    return this.status
  }

  fetchSdpb(): Promise<Uu> {
    return this.sdpbPrimrose.promise
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

  sendMissive(missive: Missive): void {
    this.send(missive.getEncoding())
  }

  private send(bytes: Uu): void {
    if (!this.getIsSendable()) {
      throw new Error('Friendship not sendable')
    }
    this.simplePeer.send(bytes.unwrap())
  }

  destroy(reason: DESTROY_REASON): void {
    if (this.isDestroyed) {
      throw new Error(
        `Cannot destroy: ${reason}, already destroyed: ${this.destroyReason}`,
      )
    }
    this.destroyReason = reason
    this.isDestroyed = true
    this.destroyedSnowdrop.emit(reason)
    this.simplePeer.removeAllListeners()
    this.simplePeer.destroy()
  }

  protected startConnectOrDestroyTimeout(): void {
    delay(this.struct.connectionTimeout * 1000).then(() => {
      if (this.isDestroyed) {
        return
      }
      if (this.status === FRIENDSHIP_STATUS.CONNECTED) {
        return
      }
      this.destroy(DESTROY_REASON.CONNECTION_TIMEOUT)
    })
  }

  protected setPeerClientId(peerClientId: Bytes32): void {
    this.peerClientId = peerClientId
  }

  protected setStatus(status: FRIENDSHIP_STATUS): void {
    if (status <= this.status) {
      throw new Error('Can only increase status')
    }
    this.status = status
    this.statusSnowdrop.emit(status)
  }

  protected getIsDestroyed(): boolean {
    return this.isDestroyed
  }

  protected sendSignal(struct: { type: string; sdpb: Uu; }): void {
    this.simplePeer.signal({
      type: struct.type,
      sdp: struct.sdpb.toUtf8(),
    })
  }

  private getIsMissiveReceived(missive: Missive): boolean {
    const missiveHashHex = missive.getHash().uu.toHex()
    return !!this.isMissiveReceivedByHashHex[missiveHashHex]
  }

  private markIsMissiveReceived(missive: Missive): void {
    const missiveHashHex = missive.getHash().uu.toHex()
    this.isMissiveReceivedByHashHex[missiveHashHex] = true
  }

  private banAndDestroy(reason: BAN_REASON): void {
    this.banReason = reason
    this.banSnowdrop.emit(this.peerClientId)
    this.destroy(DESTROY_REASON.BAN)
  }

}
