import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { UserPreferredRoommatesDao } from './../dao'
import { User, UserPreferredRoommates } from './../entity'

@injectable()
export class UserPreferredRoommatesRepository implements UserPreferredRoommatesDao {
  private readonly REPO_NAME = 'user_preferred_roommates'

  public createUserPreferredRoommate = (data: Partial<UserPreferredRoommates>) =>
    getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(UserPreferredRoommates)
      .values({ ...data })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public updateUserPreferredRoommate = (data: Partial<UserPreferredRoommates>) =>
    getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data, invitation_code: null })
      .where('inviter_id = :inviter_id AND invitee_id = :invitee_id', { inviter_id: data.inviter_id, invitee_id: data.invitee_id })
      .execute()
      .then(res => res.raw[0])

  public deleteUserPreferredRoommate = (id: number) =>
    getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .from(UserPreferredRoommates)
      .where('id = :id', { id })
      .execute()

  public deleteUserPreferredRoommateBy = (filter: any) => {
    const queries = []
    const { iduser } = filter
    if (iduser) {
      queries.push(`(user_preferred_roommates.inviter_id = '${iduser}' OR user_preferred_roommates.invitee_id = '${iduser}')`)
    }
    return getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .from(UserPreferredRoommates)
      .where(queries.join(' AND '))
      .execute()
  }

  public getUserPreferredRoommates = (iduser: string) =>
    getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(User, 'invitee', 'invitee.iduser = user_preferred_roommates.invitee_id')
      .leftJoin(User, 'inviter', 'inviter.iduser = user_preferred_roommates.inviter_id')
      .select([
        'id',
        'status',
        'created_at',
        'updated_at',
        'invitee.iduser',
        'invitee.first_name',
        'invitee.last_name',
        'invitee.img_url',
        'inviter.iduser',
        'inviter.first_name',
        'inviter.last_name',
        'inviter.img_url',
      ])
      .where('user_preferred_roommates.inviter_id = :iduser OR user_preferred_roommates.invitee_id = :iduser', { iduser })
      .getRawMany()

  public getPairedPreferredRoommate = (iduser: string) =>
    getRepository(UserPreferredRoommates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('status = \'Accepted\' AND (inviter_id = :iduser OR invitee_id = :iduser)', { iduser })
      .getOne()
}
