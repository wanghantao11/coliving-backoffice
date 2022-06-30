import { UserPreferredRoommates } from '../entity/userPreferredRoommates'

export interface UserPreferredRoommatesDao {
  createUserPreferredRoommate(data: Partial<UserPreferredRoommates>)
  updateUserPreferredRoommate(data: Partial<UserPreferredRoommates>)
  deleteUserPreferredRoommate(id: number)
  deleteUserPreferredRoommateBy(filter: any)
  getUserPreferredRoommates(iduser: string)
  getPairedPreferredRoommate(iduser: string)
}
