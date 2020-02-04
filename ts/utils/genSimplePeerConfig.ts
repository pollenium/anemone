export const stunServers = [
  'stun.l.google.com:19302',
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
  'global.stun.twilio.com:3478?transport=udp',
]


export function genSimplePeerConfig(): { iceServers: Array<{ urls: string; }>; } {
  return {
    iceServers: stunServers.sort(() => {
      return Math.random() - 0.5
    }).slice(0, 2).map((stunServer) => {
      return {
        urls: `stun:${stunServer}`,
      }
    }),
  }
}
