const Bytes = require(`${__dirname}/js/classes/Bytes`).Bytes
const Bn = require('bn.js')
const utils = require(`${__dirname}/js/utils`)
const HASHCASH_RESOLUTION_KEY = require(`${__dirname}/js/interfaces/HashcashResolution`).HASHCASH_RESOLUTION_KEY

const getNonce = utils.getNonce

onmessage = (event) => {
  const hashcashRequest = event.data

  const noncelessPrehash = Bytes.fromHex(hashcashRequest.noncelessPrehashHex)

  try {
    const nonce = getNonce(
      noncelessPrehash,
      hashcashRequest.difficulty,
      hashcashRequest.timeoutAt
    )
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.NONCE_HEX,
      value: nonce.getHex()
    }, '*')
  } catch (err) {
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR
    }, '*')
  }
}
