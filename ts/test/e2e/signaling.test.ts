/* globals test */

import { Uu } from 'pollenium-uvaursi'
import WebSocket from 'isomorphic-ws'
import { SignalingClient } from '../../classes/SignalingClient'
import { signalingServerUrls } from './lib/params'
import { Offer } from '../../classes/Signal/Offer'

const signalingClients: Array<SignalingClient> = []
const offer = new Offer({
  id: Uu.genRandom(32),
  clientId: Uu.genRandom(32),
  sdpb: Uu.genRandom(64),
})

test('signalingClient', () => {
  for (let i = 0; i < 3; i++) {
    const signalingClient = new SignalingClient({
      url: signalingServerUrls[0],
      WebSocket,
    })
    signalingClients.push(signalingClient)
  }
})

test('send/receive offers', async () => {
  const receivedPromise1 = new Promise((resolve, reject): void => {
    signalingClients[1].offerSnowdrop.addHandle((_offer) => {
      if (offer.id.uu.getIsEqual(_offer.id.uu)) {
        resolve()
      } else {
        reject(new Error('Ids dont match'))
      }
    })
  })

  const receivedPromise2 = new Promise((resolve, reject): void => {
    signalingClients[2].offerSnowdrop.addHandle((_offer) => {
      if (offer.id.uu.getIsEqual(_offer.id.uu)) {
        resolve()
      } else {
        reject(new Error('Ids dont match'))
      }
    })
  })

  signalingClients[0].sendOffer(offer)

  await Promise.all([receivedPromise1, receivedPromise2])
}, 10000)
