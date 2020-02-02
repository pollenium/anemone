// import Worker from 'tiny-worker'
// import {
//   IResolution,
//   IRequest,
//   RESOLUTION_KEY
// } from './interfaces/HashcashWorker'
// import { Bytes32 } from 'pollenium-buttercup'
// import { Primrose } from 'pollenium-primrose'
// import { Uu } from 'pollenium-uvaursi'
//
// test('hashcash worker', async () => {
//   const noncePrimrose = new Primrose<Bytes32>()
//   const worker = new Worker(`${__dirname}/../node/hashcash-worker`, [], { esm: true })
//
//   const onMessage = async (event: any): Promise<void> => {
//     const hashcashResolution: IResolution = event.data
//     switch(hashcashResolution.key) {
//       case RESOLUTION_KEY.SUCCESS:
//         noncePrimrose.resolve(new Bytes32(Uu.fromHexish(hashcashResolution.value)))
//         break;
//       case RESOLUTION_KEY.TIMEOUT_ERROR:
//         noncePrimrose.reject(new Error('Timeout'))
//         break;
//       default:
//         noncePrimrose.reject(Error('Unhandled HASHCASH_RESOLUTION_KEY'))
//     }
//   }
//
//   const nonce = await noncePrimrose.promise
//   expect(nonce).toBeInstanceOf(Bytes32)
//
// }, 10 * 1000)
