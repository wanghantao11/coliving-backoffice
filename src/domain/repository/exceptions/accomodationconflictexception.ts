export class AccomodationConflictException extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, AccomodationConflictException.prototype)
  }
}
