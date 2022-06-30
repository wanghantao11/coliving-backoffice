import { MemberTags } from './../entity'

export interface MemberTagsDao {
  createMemberTag(tag: MemberTags)
  deleteMemberTag(id: number)
  getMemberTag(id: number)
  getMemberTags(ids: number[])
  getMemberTagsByClientId(id: number)
  updateMemberTag(id: number, data: Partial<MemberTags>)
}
