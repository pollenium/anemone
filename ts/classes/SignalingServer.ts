import { server as WsServer, connection as WsConnection } from 'websocket'
import * as http from 'http'
import { Menteeship } from './Menteeship'
import enableHttpServerDestroy from 'server-destroy'

export class SignalingServer {

  menteeships: Menteeship[] = [];

  menteeshipsByOfferIdHex: {[id: string]: Menteeship} = {};

  // offers: Offer[] = [];
  // TODO: any fix
  httpServer: any;

  wsServer: any;

  constructor(public port: number) {
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

      menteeship.offerSnowdrop.addHandle((offer) => {

        const offerIdHex = offer.getId().toHex()

        this.menteeshipsByOfferIdHex[offerIdHex] = menteeship

        this.menteeships.sort(() => {
          return Math.random() - .5
        }).forEach((_menteeship) => {
          if (menteeship === _menteeship) {
            return
          }
          _menteeship.sendOffer(offer)
        })
      })

      menteeship.answerSnowdrop.addHandle((answer) => {
        this.menteeshipsByOfferIdHex[answer.offerId.toHex()].sendAnswer(answer)
      })

      menteeship.flushOfferSnowdrop.addHandle((flushOffer) => {
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
