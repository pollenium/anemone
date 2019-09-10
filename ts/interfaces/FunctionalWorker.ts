export interface FunctionalWorker extends Worker {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (funtion: string): FunctionalWorker
}
