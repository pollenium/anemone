export interface IClientOptions {
  signalingServerUrls: string[];
  bootstrapOffersTimeout: number;
  signalTimeout: number;
  friendshipsMax: number;
  missiveLatencyTolerance: number;
  wrtc?: any;
  hashcashWorkerUrl: string;
}
