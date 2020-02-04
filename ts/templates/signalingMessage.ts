import Split from 'hendricks/lib/Split'
import Dictionary from 'hendricks/lib/Dictionary'
import Fixed from 'hendricks/lib/Fixed'
import Dynamic from 'hendricks/lib/Dynamic'

const fixed32 = new Fixed(32)
const dynamic2 = new Dynamic(2)

export enum SIGNALING_MESSAGE_KEY {
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
  FLUSH = 'FLUSH'
}

export const signalingMessageTemplate = new Split(
  [
    SIGNALING_MESSAGE_KEY.OFFER,
    SIGNALING_MESSAGE_KEY.ANSWER,
    SIGNALING_MESSAGE_KEY.FLUSH,
  ],
  [
    new Dictionary(['id', 'clientId', 'sdpb'], [fixed32, fixed32, dynamic2]),
    new Dictionary(['clientId', 'offerId', 'sdpb'], [fixed32, fixed32, dynamic2]),
    new Dictionary(['offerId'], [fixed32]),
  ],
)
