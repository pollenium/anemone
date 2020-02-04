import { SignalingServer } from '../../../classes/SignalingServer'
import { signalingServerPorts } from '../lib/params'

function run(): void {
  signalingServerPorts.forEach((port) => {
    /* eslint-disable-next-line no-console */
    console.log(`Starting signaling server on port ${port}`)
    /* eslint-disable-next-line no-new */
    new SignalingServer(port)
  })
}

run()
