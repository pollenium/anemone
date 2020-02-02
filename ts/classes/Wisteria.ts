import { Snowdrop } from 'pollenium-snowdrop'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Primrose } from 'pollenium-primrose'
import delay from 'delay'

const Websocket = require('isomorphic-ws')

export class Wisteria {

  private openPrimrose: Primrose<void>;
  private closePrimrose: Primrose<void> = new Primrose<void>();
  private websocket: WebSocket

  readonly dataSnowdrop: Snowdrop<Uu> = new Snowdrop<Uu>();

  private isOpen: boolean = false;
  private dataQueue: Array<Uish> = [];

  constructor(private url) {
    this.connect()
  }

  private async connect() {

    const websocket = new Websocket(this.url)
    websocket.binaryType = 'arraybuffer'

    websocket.onopen = (): void => {
      this.isOpen = true
      while (this.dataQueue.length > 0) {
        const data = this.dataQueue.shift()
        this.send(data)
      }
    }

    websocket.onclose = async (): Promise<void> => {
      this.isOpen = false

      await delay(5000)
      this.connect()
    }

    websocket.onmessage = (message): void => {
      this.dataSnowdrop.emit(Uu.wrap(message.data))
    }

    this.websocket = websocket
  }

  handleData(data: Uish):void {
    if (this.isOpen) {
      this.send(data)
    } else {
      this.dataQueue.push(data)
    }
  }

  private send(data: Uish):void {
    this.websocket.send(Uu.wrap(data).unwrap())
  }


}
