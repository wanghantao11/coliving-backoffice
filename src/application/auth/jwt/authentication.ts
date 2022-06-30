import * as jwt from 'jsonwebtoken'

export class Authentication {
  private secret: jwt.Secret

  constructor() {
    this.secret = process.env.JWT_SECRET
  }

  public sign(data, expiresIn = '1d', algorithm: jwt.Algorithm = 'HS256') {
    return Promise.resolve(jwt.sign(data, this.secret, { algorithm, expiresIn }))
  }

  public verify(token) {
    try {
      return Promise.resolve(jwt.verify(token, this.secret))
    } catch (e) {
      return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Verification failed', detail: e.message })
    }
  }
}
