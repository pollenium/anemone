const isBrowser = module.exports.isBrowser = (typeof window === 'undefined') ? false : true

module.exports.Worker = isBrowser ? window.Worker : require('tiny-worker')
module.exports.WebSocket = isBrowser ? window.WebSocket : require('isomorphic-ws')
module.exports.wrtc = isBrowser ? null : require('wrtc')
module.exports.pollenium = isBrowser ? window.pollenium : require('../../../node/index.js')

module.exports.hashcashWorkerUrl = isBrowser ? '/browser/hashcash-worker.js' : `${__dirname}/../../../node/hashcash-worker.js`
