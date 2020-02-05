import { Missive } from './Missive'

export class MissivesDb {

  private isReceivedByIdHex: Record<string, boolean> = {};

  getIsReceived(missive: Missive): boolean {
    const missiveIdHex = missive.getId().uu.toHex()
    return this.isReceivedByIdHex[missiveIdHex] === true
  }

  markIsReceived(missive): void {
    const missiveIdHex = missive.getId().uu.toHex()
    this.isReceivedByIdHex[missiveIdHex] = true
  }

}
