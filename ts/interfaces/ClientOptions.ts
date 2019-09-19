import { ConstructableWorker } from './ConstructableWorker'
import { ConstructableWebSocket } from './ConstructableWebSocket'

export interface ClientOptions {
  signalingServerUrls: string[];
  bootstrapOffersTimeout: number;
  signalTimeout: number;
  friendsMax: number;
  friendMessageLatencyTolerance: number;
  Worker: ConstructableWorker;
  WebSocket: ConstructableWebSocket;
  wrtc?: any;
  hashcashWorkerUrl: string;
}
