const PromiseStub = require('bluebird-stub')

module.exports = {
  clients: new PromiseStub,
  signalingServers: new PromiseStub
}
