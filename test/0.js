const chai = require('chai')
const stubs = require('./stubs')

chai.use(require('chai-as-promised'))
chai.should()

process.on('unhandledRejection', async(error) => {
  throw e;
})

require('./clients')
