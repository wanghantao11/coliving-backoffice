import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { AdminMemberNotesDao } from '../dao'
import { AdminMemberNotes } from '../entity'

@injectable()
export class AdminMemberNotesRepository implements AdminMemberNotesDao {
  private readonly REPO_NAME = 'admin_member_notes'

  public getAdminMemberNotes = (iduser: string) =>
    getRepository(AdminMemberNotes, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = :iduser', { iduser })
      .getOne()

  public createAdminMemberNotes = (data: Partial<AdminMemberNotes>) =>
    getRepository(AdminMemberNotes, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(AdminMemberNotes)
      .values({ ...data })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public updateAdminMemberNotes = (iduser: string, data: Partial<AdminMemberNotes>) =>
    getRepository(AdminMemberNotes, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('iduser = :iduser', { iduser })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
