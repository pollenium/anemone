import * as Split from 'hendricks/lib/Split'
import * as Dictionary from 'hendricks/lib/Dictionary'
import * as Fixed from 'hendricks/lib/Fixed'
import * as Dynamic from 'hendricks/lib/Dynamic'

const fixed32 = new Fixed(32)
const dynamic2 = new Dynamic(2)

export enum SIGNALING_MESSAGE_KEY {
  OFFER = 'OFFER',
  ANSWER = 'ANSWER'
}

export const signalingMessageTemplate = new Split([
  SIGNALING_MESSAGE_KEY.OFFER,
  SIGNALING_MESSAGE_KEY.ANSWER
], [
  new Dictionary([
    'clientNonce',
    'sdpb'
  ], [
    fixed32,
    dynamic2,
  ]),
  new Dictionary([
    'clientNonce',
    'offerId',
    'sdpb'
  ], [
    fixed32,
    fixed32,
    dynamic2
  ])
])
