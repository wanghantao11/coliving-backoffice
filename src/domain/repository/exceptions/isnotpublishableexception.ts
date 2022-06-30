export class IsNotPublishableException extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, IsNotPublishableException.prototype)
  }
}
