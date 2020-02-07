import { Uintable, Uint256, Uint8 } from 'pollenium-buttercup'

const two256 = Uint256.fromNumber(2)
const twofiftyfive256 = Uint256.fromNumber(255)

export function genMaxScore(struct: {
  difficulty: Uintable;
  cover: Uintable;
  applicationDataLength: Uintable;
}): Uint256 {
  const difficulty = Uint8.fromUintable(struct.difficulty)
  const cover = Uint256.fromUintable(struct.cover)
  const applicationDataLength = Uint256.fromUintable(struct.applicationDataLength)

  const pow = twofiftyfive256.opSub(difficulty)
  const divisor = cover.opAdd(applicationDataLength)
  const MaxScore = two256.opPow(pow).opDiv(divisor)
  return MaxScore
}
