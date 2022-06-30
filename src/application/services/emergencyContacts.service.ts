import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { EmergencyContactsDao } from './../../domain/dao'
import { EmergencyContacts } from './../../domain/entity'

@injectable()
export class EmergencyContactsService {
  constructor(
    @inject('EmergencyContactsDao') private emergencyContactsDao: EmergencyContactsDao
  ) {}

  public createContact = (iduser: string, data: EmergencyContacts) => this.emergencyContactsDao.createContact(iduser, data)

  public getContacts = (iduser: string) => this.emergencyContactsDao.getContacts(iduser)

  public updateContact = (id: number, data: Partial<EmergencyContacts>) => this.emergencyContactsDao.updateContact(id, data)

  public deleteContact = (id: number) => this.emergencyContactsDao.deleteContact(id)
}
