export interface ConstructableWorker extends Worker {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (funtion: string, any1?: any, any2?: any): ConstructableWorker
}
