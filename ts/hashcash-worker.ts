import { genNonce, TimeoutError } from './utils/genNonce'
import { IRequest, IResolution, RESOLUTION_KEY } from './interfaces/HashcashWorker'
import { Uu } from 'pollenium-uvaursi'

// eslint-disable-next-line no-undef
onmessage = (event): void => {
  const request: IRequest = event.data

  let resolution: IResolution

  try {
    const nonce = genNonce({
      noncelessPrehash: Uu.fromHexish(request.noncelessPrehashHex),
      ...request
    })
    resolution = {
      key: RESOLUTION_KEY.SUCCESS,
      value: nonce.uu.toHex()
    }
    postMessage(resolution, [])
  } catch (error) {
    if (error instanceof TimeoutError) {
      resolution = {
        key: RESOLUTION_KEY.TIMEOUT_ERROR,
        value: 'TIMEOUT'
      }
    } else if (error instanceof Error) {
      resolution = {
        key: RESOLUTION_KEY.GENERIC_ERROR,
        value: error.message
      }
    } else {
      resolution = {
        key: RESOLUTION_KEY.GENERIC_ERROR,
        value: 'Unknown Error'
      }
    }
    postMessage(resolution, [])
  }
}
