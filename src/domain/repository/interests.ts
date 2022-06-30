import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { InterestsDao } from '../dao/interests.dao'
import { Interests } from '../entity/interests'

@injectable()
export class InterestsRepository implements InterestsDao {
  private readonly REPO_NAME = 'interests'

  public getInterests = () =>
    getRepository(Interests, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .getMany()

  public getInterestsByIds = (ids: number[]) =>
    getRepository(Interests, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id IN (:...ids)', { ids })
      .getMany()
}
