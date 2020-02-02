import { SignalingServer } from '../../classes/SignalingServer'
import { signalingServerPorts } from '../lib/params'

async function run() {
  signalingServerPorts.map((port) => {
    console.log(`Starting signaling server on port ${port}`)
    return new SignalingServer(port)
  })
}

run()
