import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { MemberTagsDao } from './../../domain/dao'
import { MemberTags } from './../../domain/entity'

@injectable()
export class MemberTagsRepository implements MemberTagsDao {
  private readonly REPO_NAME = 'member_tags'

  public createMemberTag = (tag: MemberTags): Promise<MemberTags> =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(MemberTags)
      .values({ ...tag })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteMemberTag = (id: number) =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getMemberTag = (id: number) =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getMemberTags = (ids: number[]) =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id IN (:...ids)', { ids })
      .getMany()

  public getMemberTagsByClientId = (id: number) =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('client_id = :id', { id })
      .getMany()

  public updateMemberTag = (id: number, data: Partial<MemberTags>) =>
    getRepository(MemberTags, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
