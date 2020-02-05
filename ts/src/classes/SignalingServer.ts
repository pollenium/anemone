import { server as WsServer, connection as WsConnection } from 'websocket'
import enableHttpServerDestroy from 'server-destroy'
import * as http from 'http'
import { Menteeship } from './Menteeship'

export class SignalingServer {

  menteeships: Menteeship[] = [];
  menteeshipsByOfferIdHex: Record<string, Menteeship> = {};
  httpServer: http.Server;
  wsServer: WsServer;

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
      autoAcceptConnections: true,
    })

    this.wsServer.on('connect', (wsConnection: WsConnection) => {
      const menteeship = new Menteeship(this, wsConnection)
      this.menteeships.push(menteeship)

      menteeship.offerSnowdrop.addHandle((offer) => {
        const offerIdHex = offer.id.uu.toHex()
        this.menteeshipsByOfferIdHex[offerIdHex] = menteeship
        this.menteeships
          .sort(() => {
            return Math.random() - 0.5
          })
          .forEach((_menteeship) => {
            if (menteeship === _menteeship) {
              return
            }
            _menteeship.sendOffer(offer)
          })
      })

      menteeship.answerSnowdrop.addHandle((answer) => {
        this.menteeshipsByOfferIdHex[answer.offerId.uu.toHex()].sendAnswer(answer)
      })

      menteeship.flushOfferSnowdrop.addHandle((flushOffer) => {
        this.menteeships
          .sort(() => {
            return Math.random() - 0.5
          })
          .forEach((_menteeship) => {
            _menteeship.sendFlush(flushOffer)
          })
      })
    })
  }

  destroy(): void {
    this.wsServer.shutDown()
    this.httpServer.close()
    this.menteeships.forEach((menteeship) => {
      menteeship.destroy()
    })
  }

}
