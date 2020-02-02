import { Uintable } from 'pollenium-buttercup'
import { Uish } from 'pollenium-uvaursi'

export interface IRequest {
  noncelessPrehashHex: string;
  difficulty: number;
  cover: number;
  applicationDataLength: number;
  timeoutAt: number;
}


export enum RESOLUTION_KEY {
  SUCCESS = 0,
  TIMEOUT_ERROR = 1,
  GENERIC_ERROR = 2
}

export interface IResolution {
  key: RESOLUTION_KEY;
  value: string;
}
