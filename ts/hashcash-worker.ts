import { genNonce } from './utils'
import { HASHCASH_RESOLUTION_KEY } from './interfaces/HashcashResolution'


// eslint-disable-next-line no-undef
onmessage = (event): void => {
  const hashcashRequest = event.data

  try {
    const nonce = genNonce(hashcashRequest)
    // eslint-disable-next-line no-undef
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.NONCE_HEX,
      value: nonce.uu.toHex()
    }, [])
  } catch (err) {
    // eslint-disable-next-line no-undef
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR
    }, [])
  }
}
