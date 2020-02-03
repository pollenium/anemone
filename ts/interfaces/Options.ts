import { Bytes32 } from 'pollenium-buttercup'

export interface IFriendshipPartyOptions {
  wrtc: any,
  missiveLatencyTolerance: number
}

export interface IFriendshipOptions extends IFriendshipPartyOptions {
  initiator: boolean
}


export interface IClientPartyOptions extends IFriendshipPartyOptions {
  bootstrapOffersTimeout: number;
  maxFriendshipsCount: number;
  maxOfferAttemptsCount: number;
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
