import { Bytes32 } from 'pollenium-buttercup'
import { Summary, Jsonable } from './Summary'
import { PartySummary } from './PartySummary'

export class ClientSummary extends Summary {

  readonly id: Bytes32;
  readonly partySummary: PartySummary;

  constructor(readonly struct: { id: Bytes32; partySummary: PartySummary; }) {
    super()
  }

  toJsonable(): Jsonable {
    return {
      idHex: this.struct.id.uu.toHex(),
      partySummary: this.struct.partySummary.toJsonable(),
    }
  }

}
