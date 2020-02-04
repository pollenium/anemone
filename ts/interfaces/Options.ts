import { Bytes32 } from 'pollenium-buttercup'

export interface FriendshipPartyOptions {
  wrtc: any;
  missiveLatencyTolerance: number;
  sdpTimeout: number;
  connectionTimeout: number;
}

export interface FriendshipOptions extends FriendshipPartyOptions {
  initiator: boolean;
}

export interface ExtrovertsGroupOptions extends FriendshipPartyOptions {
  offerReuploadnterval: number;
}


export interface ClientPartyOptions extends FriendshipPartyOptions, ExtrovertsGroupOptions {
  bootstrapOffersTimeout: number;
  maxFriendshipsCount: number;
  maxOfferAttemptsCount: number;
  maxOfferLastReceivedAgo: number;
}

export interface PartyOptions extends ClientPartyOptions {
  clientd: Bytes32;
}

export interface SignalingClientsManagerOptions {
  signalingServerUrls: string[];
}
