import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { UserScoreDao } from './../../domain/dao'
import { aggregateRawUserScore } from '../../infrastructure/utils/offer'

@injectable()
export class UserScoreService {
  constructor(
    @inject('UserScoreDao') private userScoreDao: UserScoreDao
  ) {}

  public saveScoreFromWebhook = (iduser: string, rawData: any[]) =>
    Promise.resolve(aggregateRawUserScore(rawData))
      .then(aggregatedData => this.userScoreDao.createUserScore({ iduser, ...aggregatedData }))
}
