import { EmergencyContacts } from '../entity/emergencyContacts'

export interface EmergencyContactsDao {
  createContact(iduser: string, data: EmergencyContacts)
  getContacts(iduser: string)
  updateContact(id: number, data: Partial<EmergencyContacts>)
  deleteContact(id: number)
}
