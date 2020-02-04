import { Bytes32 } from 'pollenium-buttercup'

export interface IFriendshipPartyOptions {
  wrtc: any,
  missiveLatencyTolerance: number,
  sdpTimeout: number,
  connectionTimeout: number
}

export interface IFriendshipOptions extends IFriendshipPartyOptions {
  initiator: boolean
}

export interface IExtrovertsGroupOptions extends IFriendshipPartyOptions {
  offerReuploadInterval: number
}


export interface IClientPartyOptions extends IFriendshipPartyOptions, IExtrovertsGroupOptions {
  bootstrapOffersTimeout: number;
  maxFriendshipsCount: number;
  maxOfferAttemptsCount: number;
  maxOfferLastReceivedAgo: number;
}

export interface IPartyOptions extends IClientPartyOptions {
  clientId: Bytes32
}

export interface ISignalingClientsManagerOptions {
  signalingServerUrls: string[];
}

export interface IClientOptions extends
  IClientPartyOptions,
  ISignalingClientsManagerOptions
  {}
