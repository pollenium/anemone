import { Uint40 } from 'pollenium-buttercup'
import { genTime } from './genTime'

export function genTimestamp(): Uint40 {
  return Uint40.fromNumber(genTime())
}
