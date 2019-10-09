import { server as WsServer, connection as WsConnection } from 'websocket'
import * as http from 'http'
import { Menteeship } from './Menteeship'
import EventEmitter from 'events'
import { Offer } from './Offer'
import enableHttpServerDestroy from 'server-destroy'

export class SignalingServer extends EventEmitter {

  menteeships: Menteeship[] = [];

  menteeshipsByOfferIdHex: {[id: string]: Menteeship} = {};

  // offers: Offer[] = [];
  // TODO: any fix
  httpServer: any;

  wsServer: any;

  constructor(public port: number) {
    super()
    this.bootstrap()
  }

  bootstrap(): void {
    this.httpServer = http.createServer((_request, response) => {
      response.writeHead(404)
      response.end()
    })
    enableHttpServerDestroy(this.httpServer)
    this.httpServer.listen(this.port, () => {})

    this.wsServer = new WsServer({
      httpServer: this.httpServer,
      autoAcceptConnections: true
    })

    this.wsServer.on('connect', (wsConnection: WsConnection) => {
      const menteeship = new Menteeship(this, wsConnection)
      this.menteeships.push(menteeship)

      menteeship.on('offer', (offer: Offer) => {

        const offerIdHex = offer.getId().getHex()

        this.menteeshipsByOfferIdHex[offerIdHex] = menteeship

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

      menteeship.on('flushOffer', (flushOffer) => {
        this.menteeships.sort(() => {
          return Math.random() - .5
        }).forEach((_menteeship) => {
          _menteeship.sendFlushOffer(flushOffer)
        })
      })
    })
  }

  destroy(): void {
    this.wsServer.shutDown()
    this.httpServer.destroy()
  }
}
