import { server as WsServer } from 'websocket'
import * as http from 'http'
import { Menteeship } from './Menteeship'
import * as EventEmitter from 'events'
import { Offer } from './Offer'

let debugId = 0;

export class SignalingServer extends EventEmitter {

  debugId: number = debugId++;
  menteeships: Menteeship[] = [];
  menteeshipsByOfferIdHex: {[id: string]: Menteeship} = {};
  // offers: Offer[] = [];
  httpServer;
  wsServer;

  constructor(public port: number) {
    super()
    this.bootstrap()
  }

  bootstrap() {
    this.httpServer = http.createServer((request, response) => {
      response.writeHead(404)
      response.end()
    })
    this.httpServer.listen(this.port, () => {})

    this.wsServer = new WsServer({
      httpServer: this.httpServer,
      autoAcceptConnections: true
    })

    this.wsServer.on('connect', (wsConnection) => {
      const menteeship = new Menteeship(this, wsConnection)
      this.menteeships.push(menteeship)

      menteeship.on('offer', (offer: Offer) => {

        const offerIdHex = offer.getId().getHex()

        this.menteeshipsByOfferIdHex[offerIdHex] = menteeship

        // this.offers = this.offers.filter((_offer) => {
        //   return !offer.clientNonce.equals(_offer.clientNonce)
        // })
        //
        // this.offers.unshift(offer)

        this.menteeships.sort(() => {
          return Math.random() - .5
        }).forEach((_menteeship) => {
          if (menteeship === _menteeship) {
            return
          }
          _menteeship.sendOffer(offer)
        })

        this.emit('offer', offer)
      })

      menteeship.on('answer', (answer) => {
        this.menteeshipsByOfferIdHex[answer.offerId.getHex()].sendAnswer(answer)
      })
    })
  }
}
