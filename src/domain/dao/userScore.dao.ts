import { UserScore } from '../../domain/entity'

export interface UserScoreDao {
  createUserScore(userScore: UserScore)
  getUserScoreByExternalId(iduser: string): Promise<UserScore>
  getUserScoresByExternalIds(idusers: string[]): Promise<UserScore[]>
}
