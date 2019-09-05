export enum HASHCASH_RESOLUTION_KEY {
  NONCE_HEX = 0,
  TIMEOUT_ERROR = 1
}

export interface HashcashResolution {
  key: HASHCASH_RESOLUTION_KEY;
  value: string;
}
