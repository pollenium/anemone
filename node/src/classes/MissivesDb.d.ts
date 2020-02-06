import { Missive } from './Missive';
export declare class MissivesDb {
    private isReceivedByIdHex;
    getIsReceived(missive: Missive): boolean;
    markIsReceived(missive: any): void;
}
