import { FunctionalWorker } from './FunctionalWorker'

export interface ClientOptions {
  signalingServerUrls: string[];
  signalTimeout: number;
  friendsMax: number;
  friendMessageLatencyTolerance: number;
  Worker: FunctionalWorker;
}
