export class NotFoundException extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, NotFoundException.prototype)
  }
}
