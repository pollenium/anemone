const stubs = require('../stubs')
const params = require('../params')
const utils = require('../utils')

const missives = []
const expectedReceivalsCount = params.missivesCount * (params.clientsCount - 1)

require('./clients')

describe('missives', () => {
  let clients

  before(async () => {
    clients = await stubs.clients.promise
  })
  it('should have clients', () => {
    clients.length.should.equal(7)
  })
  for (let i = 0; i < params.missivesCount; i++) {
    it(`should create missives #${i}`, async () => {
      const client = clients[Math.floor(Math.random() * clients.length)]
      const missiveGenerator = new utils.pollenium.MissiveGenerator(
        client,
        utils.pollenium.Buttercup.random(32),
        utils.pollenium.Buttercup.random(32),
        1
      )
      const missive = await missiveGenerator.fetchMissive()
      missives.push(missive)
    })
  }
  it(`should send message and be received ${expectedReceivalsCount} times`, (done) => {
    let i = 0
    clients.forEach((client) => {
      client.on('friendship.missive', (_missive) => {
        i++
        if (i === expectedReceivalsCount) {
          setTimeout(() => {
            if (i === expectedReceivalsCount) {
              done()
            } else {
              done(`Received ${i} times`)
            }
          }, 2000)
        }
      })
    })
    missives.forEach((missive) => {
      missive.broadcast()
    })

  })
})
