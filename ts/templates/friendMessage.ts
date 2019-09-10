import Split from 'hendricks/lib/Split'
import Dictionary from 'hendricks/lib/Dictionary'
import Fixed from 'hendricks/lib/Fixed'
import Dynamic from 'hendricks/lib/Dynamic'

const fixed1 = new Fixed(1)
const fixed5 = new Fixed(5)
const fixed32 = new Fixed(32)
const dynamic2 = new Dynamic(2)

export enum FRIEND_MESSAGE_KEY {
  V0 = 'V0'
}


export const friendMessageTemplate = new Split(['V0'], [
  new Dictionary([
    'timestamp',
    'difficulty',
    'applicationId',
    'applicationData',
    'nonce'
  ], [
    fixed5,
    fixed1,
    fixed32,
    dynamic2,
    fixed32
  ])
])
