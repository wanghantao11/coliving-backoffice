export class DataSourceException extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, DataSourceException.prototype)
  }
}
