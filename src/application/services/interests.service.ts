import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { InterestsDao } from './../../domain/dao'

@injectable()
export class InterestsService {
  constructor(
    @inject('InterestsDao') private interestsDao: InterestsDao
  ) {}

  public getInterests = () => this.interestsDao.getInterests()
}
