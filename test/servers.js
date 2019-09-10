const stubs = require('./stubs')
const params = require('./params')
const SignalingServer = require('../js/classes/SignalingServer').SignalingServer

const signalingServerPorts = [5010, 5011, 5012]
const signalingServers = []

describe('servers', () => {

  process.on('exit', function (){
  console.log('Goodbye!');
})

  after(() => {
    stubs.signalingServers.resolve(signalingServers)
  })

  it('should create servers', () => {
    stubs.signalingServers.resolve(signalingServerPorts.map((port) => {
      try {
        return new SignalingServer(port)
      } catch(error) {
        process.exit()
      }
    }))
  })
})
