import { isBrowser } from './isBrowser'

export const hashcashWorkerUrl = isBrowser
  ? './browser/hashcash-worker.js'
  : `${__dirname}/../../../node/hashcash-worker.js`
