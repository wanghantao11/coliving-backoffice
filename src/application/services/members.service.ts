import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { find, orderBy } from 'lodash'

import { ApplicationDao, ContractDao, OfferDao, RoomDao, UserDao, UserScoreDao } from './../../domain/dao'

import { scoreInPercentageGenerator } from '../../infrastructure/utils/offer'

@injectable()
export class MembersService {
  constructor(
    @inject('ApplicationDao') private applicationDao: ApplicationDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('OfferDao') private offerDao: OfferDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('UserScoreDao') private userScoreDao: UserScoreDao
  ) {}

  public getInterestedMembers = (query: any) => this.applicationDao.getInterestedMembers(query)

  public getPendingOfferMembers = (query: any) => this.offerDao.getPendingOfferMembers(query)

  public getContractMembers = (query: any) => this.contractDao.getContractMembers(query)

  public getSubscribedMembers = (facadeId: number, apartmentId: number, query: any) => {
    const { matching_score, sort_by, sort_order, offset = 0, limit = 10 } = query
    const matchingScore = Number(matching_score)
    const sliceStart = Number(offset)
    const sliceEnd = Number(offset) + Number(limit)
    let total: number
    return this.userDao.getSubscribedMembers(facadeId, query)
      .then(([count, members]) => count === 0 ?
        Promise.reject({ message: 'NO_CONTENT', reason: `No subscribed member found for project facade ${facadeId} with apartment ${apartmentId}` })
        : (total = count, members.map(member => ({ ...member, matchingScore: '' }))))
      .then(members => Promise.resolve(members.filter(member => member.is_test_complete))
        .then(membersCompleteTest =>
          membersCompleteTest.length !== 0 ?
            this.getSubscribedMembersMatchScore(membersCompleteTest.map(member => member.iduser), apartmentId)
              .then(membersScore => membersCompleteTest.map(
                member => ({
                  ...member,
                  matchingScore: (find(membersScore, ['iduser', member.iduser]) || { matchingScore: '' }).matchingScore,
                })
              )) : membersCompleteTest)
        .then(membersWithScore => matchingScore ? membersWithScore.filter(member => member.matchingScore >= matchingScore) : membersWithScore)
        .then(membersWithScore => ([...membersWithScore, ...members.filter(member => !member.is_test_complete)]))
      )
      .then(membersWithScore => sort_by !== 'score' ? membersWithScore
        : orderBy(membersWithScore, 'matchingScore', [sort_order.toLowerCase()]))
      .then(membersWithScoreSorted => Promise.all(membersWithScoreSorted.map(({ user_preferred_roommates, ...rest }) =>
        user_preferred_roommates ? this.getSubscribedMembersMatchScore([user_preferred_roommates[0].iduser], apartmentId)
          .then(scoreList => scoreList.length === 0 ?
            ({ user_preferred_roommates: { matchingScore: '', ...user_preferred_roommates[0] }, ...rest }) :
            ({ user_preferred_roommates: { matchingScore: scoreList[0].matchingScore, ...user_preferred_roommates[0] }, ...rest }))
          : ({ user_preferred_roommates, ...rest }))))
      .then(membersWithScoreSorted => ([total, membersWithScoreSorted.slice(sliceStart, sliceEnd)]))
  }

  private getSubscribedMembersMatchScore = (idusers: string[], apartmentId: number) =>
    Promise.all([this.userScoreDao.getUserScoresByExternalIds(idusers),
      this.roomDao.getRoomsBy({ apartmentIds: [apartmentId] })
        .then(rooms => this.roomDao.getUserScoresForTenantsAndCandidatesByRoomIds(rooms.map(room => room.id)))])
      .then(([userScores, tenantAndCandidateScores]) => userScores.map(userScore => (
        { iduser: userScore.iduser, matchingScore: scoreInPercentageGenerator(userScore, tenantAndCandidateScores) }
      )))
}
