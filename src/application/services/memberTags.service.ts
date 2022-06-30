import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { MemberTagsDao } from './../../domain/dao'
import { MemberTags } from '../../domain/entity'

@injectable()
export class MemberTagsService {
  constructor(
    @inject('MemberTagsDao') private memberTagsDao: MemberTagsDao
  ) {}

  public createMemberTag = (memberTag: MemberTags) => this.memberTagsDao.createMemberTag(memberTag)

  public deleteMemberTag = (id: string) => this.memberTagsDao.deleteMemberTag(Number(id))

  public getMemberTagsByClientId = (id: number) => this.memberTagsDao.getMemberTagsByClientId(id)

  public updateMemberTag = (id: string, data: Partial<MemberTags>) =>
    this.memberTagsDao.updateMemberTag(Number(id), data)
}
