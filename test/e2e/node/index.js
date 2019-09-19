const chai = require('chai')

chai.use(require('chai-as-promised'))
chai.should()


require('./tests/friendMessageGenerator')
require('./tests/getNonce')
require('./tests/clients')
require('./tests/messages')
