export const signalingServerPorts: Array<number> = [5010, 5011, 5012]
export const signalingServerUrls: Array<string> = signalingServerPorts.map((port) => {
  return `ws://localhost:${port}`
})
export const clientsCount = 7
export const maxFriendshipsCount = 4
export const missivesCount = 4
export const expectedMissiveReceivesCount = missivesCount * (clientsCount - 1)
