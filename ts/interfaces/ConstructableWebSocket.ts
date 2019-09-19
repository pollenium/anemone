export interface ConstructableWebSocket extends WebSocket {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (url: string): ConstructableWebSocket
}
