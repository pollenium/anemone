import { Uish } from 'pollenium-uvaursi'

export interface PartialOffer {
  id: Uish;
  sdpb: Uish;
}

export interface PartialAnswer {
  offerId: Uish;
  sdpb: Uish;
}

export interface PartialFlush {
  offerId: Uish;
}
