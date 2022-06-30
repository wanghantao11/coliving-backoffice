import { User } from './../entity/user'
import { IUser } from '../../interfaces/user'

export interface UserDao {
  createUser(user: User)
  deleteUserByExternalId(iduser: string)
  getUserBy(query: any): Promise<IUser>
  getUsersBy(query?: any): Promise<User[]>
  getUsersCountBy(query?: any): Promise<number>
  getSubscribedMembers(facadeId: number, query: any)
  getTotalNumberOfUsersByClientId(clientId: number)
  updateUserBy(query: any, data: Partial<User>)
  getCountOfUsersByDateRange(startDate: string, endDate: string)
}
