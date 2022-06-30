export class DuplicateException extends Error {
  constructor(public readonly message: string) {
    super(message)
    Object.setPrototypeOf(this, DuplicateException.prototype)
  }
}
