import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { UserScoreDao } from '../dao'
import { UserScore } from '../entity'

@injectable()
export class UserScoreRepository implements UserScoreDao {
  private readonly REPO_NAME = 'user_score'

  public createUserScore = (userScore: UserScore) =>
    getRepository(UserScore, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(UserScore)
      .values({ ...userScore })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getUserScoreByExternalId = (iduser: string): Promise<UserScore> =>
    getRepository(UserScore, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = iduser', { iduser })
      .getOne()

  public getUserScoresByExternalIds = (idusers: string[]): Promise<UserScore[]> =>
    getRepository(UserScore, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser IN (:...idusers)', { idusers })
      .getMany()
}
