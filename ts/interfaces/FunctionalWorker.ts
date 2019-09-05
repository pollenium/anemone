export interface FunctionalWorker extends Worker {
  new (funtion: string): FunctionalWorker
}
