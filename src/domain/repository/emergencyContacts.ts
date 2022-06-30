import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { EmergencyContactsDao } from '../dao/emergencyContacts.dao'
import { EmergencyContacts } from '../entity/emergencyContacts'

@injectable()
export class EmergencyContactsRepository implements EmergencyContactsDao {
  private readonly REPO_NAME = 'emergency_contacts'

  public createContact = (iduser: string, data: EmergencyContacts) =>
    getRepository(EmergencyContacts, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(EmergencyContacts)
      .values({ iduser, ...data })
      .returning('name, image, phone, relation')
      .execute()
      .then(res => res.raw[0])

  public deleteContact = (id: number) =>
    getRepository(EmergencyContacts, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getContacts = (iduser: string) =>
    getRepository(EmergencyContacts, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = :iduser', { iduser })
      .getMany()

  public updateContact = (id: number, data: Partial<EmergencyContacts>) =>
    getRepository(EmergencyContacts, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('name, image, phone, relation')
      .execute()
      .then(res => res.raw[0])
}
