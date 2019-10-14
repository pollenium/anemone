export interface HashcashRequest {
  noncelessPrehashHex: string;
  difficulty: number;
  cover: number;
  applicationDataLength: number;
  timeoutAt: number;
}
