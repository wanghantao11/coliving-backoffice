import { AdminMemberNotes } from '../../domain/entity'

export interface AdminMemberNotesDao {
  getAdminMemberNotes(iduser: string)
  createAdminMemberNotes(data: Partial<AdminMemberNotes>)
  updateAdminMemberNotes(iduser: string, data: Partial<AdminMemberNotes>)
}
