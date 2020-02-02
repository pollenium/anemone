import { Uish } from 'pollenium-uvaursi'

export interface ISignal {
  clientId: Uish;
}

export interface IPartialOffer {
  id: Uish;
  sdpb: Uish;
}

export interface IPartialAnswer {
  offerId: Uish;
  sdpb: Uish;
}

export interface IPartialFlush {
  offerId: Uish
}

export interface IOffer extends ISignal, IPartialOffer {}
export interface IAnswer extends ISignal, IPartialAnswer {}
