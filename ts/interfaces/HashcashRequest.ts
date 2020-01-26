import { Uintable } from 'pollenium-buttercup'
import { Uish } from 'pollenium-uvaursi'

export interface HashcashRequest {
  noncelessPrehash: Uish;
  difficulty: Uintable;
  cover: Uintable;
  applicationDataLength: Uintable;
  timeoutAt: number;
}
