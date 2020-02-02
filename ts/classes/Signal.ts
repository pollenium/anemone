import { Uu } from 'pollenium-uvaursi'
import * as shasta from 'pollenium-shasta'
import { Bytes32 } from 'pollenium-buttercup'

export abstract class Signal {

  private hash: Bytes32;

  getHash(): Bytes32 {
    if (this.hash) {
      return this.hash
    }
    this.hash = new Bytes32(shasta.genSha256(this.getEncoding()))
    return this.hash
  }

  abstract getEncoding(): Uu;
}
