import { Snowdrop } from 'pollenium-snowdrop'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Primrose } from 'pollenium-primrose'
import delay from 'delay'
import WebSocket from 'ws'

export interface WisteriaStruct {
  url: string;
}

export class Wisteria {

  private openPrimrose: Primrose<void>;
  private closePrimrose: Primrose<void> = new Primrose<void>();
  private webSocket: WebSocket;

  readonly dataSnowdrop: Snowdrop<Uu> = new Snowdrop<Uu>();

  private isOpen: boolean = false;
  private dataQueue: Array<Uish> = [];

  constructor(private struct: WisteriaStruct) {
    this.connect()
  }

  private async connect(): Promise<void> {
    const webSocket = new WebSocket(this.struct.url)
    webSocket.binaryType = 'arraybuffer'
    webSocket.onopen = (): void => {
      this.isOpen = true
      while (this.dataQueue.length > 0) {
        const data = this.dataQueue.shift()
        this.send(data)
      }
    }
    webSocket.onclose = async (): Promise<void> => {
      this.isOpen = false
      await delay(5000)
      this.connect()
    }
    webSocket.onmessage = (message): void => {
      this.dataSnowdrop.emit(Uu.wrap(message.data as ArrayBuffer))
    }
    this.webSocket = webSocket
  }

  handleData(data: Uish): void {
    if (this.isOpen) {
      this.send(data)
    } else {
      this.dataQueue.push(data)
    }
  }

  private send(data: Uish): void {
    this.webSocket.send(Uu.wrap(data).unwrap())
  }

}
