import { isBrowser } from './isBrowser'

export const hashcashWorkerUrl = isBrowser
  ? './browser/hashcash-worker.js'
  : `${__dirname}/../../../node/src/hashcash-worker.js`
