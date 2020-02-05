/* globals postMessage */

import { Uu } from 'pollenium-uvaursi'
import { genNonce, TimeoutError } from './utils/genNonce'
import {
  HashcashWorkerRequest,
  HashcashWorkerResolution,
  HASHCASH_WORKER_RESOLUTION_KEY,
} from './interfaces/HashcashWorker'

// eslint-disable-next-line no-undef
onmessage = (event): void => {
  const request: HashcashWorkerRequest = event.data

  let resolution: HashcashWorkerResolution

  try {
    const nonce = genNonce({
      noncelessPrehash: Uu.fromHexish(request.noncelessPrehashHex),
      ...request,
    })
    resolution = {
      key: HASHCASH_WORKER_RESOLUTION_KEY.SUCCESS,
      value: nonce.uu.toHex(),
    }
    postMessage(resolution, [])
  } catch (error) {
    if (error instanceof TimeoutError) {
      resolution = {
        key: HASHCASH_WORKER_RESOLUTION_KEY.TIMEOUT_ERROR,
        value: 'TIMEOUT',
      }
    } else if (error instanceof Error) {
      resolution = {
        key: HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR,
        value: error.message,
      }
    } else {
      resolution = {
        key: HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR,
        value: 'Unknown Error',
      }
    }
    postMessage(resolution, [])
  }
}
