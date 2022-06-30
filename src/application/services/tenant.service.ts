import 'reflect-metadata'
import { inject, injectable } from 'inversify'

import { AdminDao, ContractDao, ProjectFacadeDocumentDao, RoomDao, TenantDao, UserDao } from './../../domain/dao'
import { CONTRACT_STATUS, HOST, TENANT, USER_TYPE } from './../../infrastructure/constants'
import { checkPassword, excludeKeysFromObject, hashPassword } from './../../infrastructure/utils/common'
import { signInTenant } from './../auth/jwt/service'
import { signInWithEmailAndPassword } from './../firebase/user'
import { createChatToken } from './../getstream/chat'

@injectable()
export class TenantService {
  constructor(
    @inject('AdminDao') private adminDao: AdminDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('ProjectFacadeDocumentDao') private projectFacadeDocumentDao: ProjectFacadeDocumentDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('TenantDao') private tenantDao: TenantDao,
    @inject('UserDao') private userDao: UserDao
  ) {}

  /**
   * NOTE:
   * If no password in db, authenticate with firebase first and hash the password, store it in db,
   * otherwise, check the password with hashed one and login
   *
   * For backward compatibility with firebase auth
   */
  public login = (email: string, password: string) =>
    this.userDao.getUserBy({ email })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : user)
      .then(user => user.user_type !== USER_TYPE.TENANT ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${email} is not tenant` }) : user)
      .then(user => this.contractDao.getContractBy({ iduser: user.iduser, status: [CONTRACT_STATUS.ACTIVE] })
        .then(contract => !contract ?
          Promise.reject({ message: 'NOT_ALLOWED', reason: `No active contract is found for user ${email}` })
          : ({ ...user, facade_id: contract.facade_id, room_id: contract.room_id })))
      .then(tenant => this.roomDao.getRoomBy({ id: tenant.room_id })
        .then(room => !tenant.password ?
          signInWithEmailAndPassword(email, password)
            .then(() => hashPassword(password))
            .then(hashedPassword => this.userDao.updateUserBy({ iduser: tenant.iduser }, { password: hashedPassword })
              .then(updatedUser => createChatToken(tenant.iduser)
                .then(chatToken => signInTenant(updatedUser.iduser, tenant.facade_id, room.apartment_id, chatToken, TENANT))))
          : checkPassword(password, tenant.password).then(isVerified => isVerified ?
            createChatToken(tenant.iduser)
              .then(chatToken => signInTenant(tenant.iduser, tenant.facade_id, room.apartment_id, chatToken, TENANT))
            : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for user ${email}` })
          )))

  public getHostsByFacadeId = (facadeId: number) => this.adminDao.getAdminsBy({ roles: [HOST.name], facadeIds: [facadeId] })

  public getTenants = (iduser: string, facade_id: number, query: any) =>
    this.tenantDao.getTenants(iduser, facade_id, query)

  public getTenantDetailById = (iduser: string) =>
    this.tenantDao.getTenantDetailById(iduser)
      .then(tenant => !tenant ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : tenant)

  public getTenantDocumentsByFacadeId = (facadeId: number) =>
    this.projectFacadeDocumentDao.getProjectFacadeDocumentsByFacadeId(facadeId)

  public getOtherTenantDetailById = (iduser: string) =>
    this.getTenantDetailById(iduser).then(excludeKeysFromObject('birthday', 'gender', 'registration_time'))

  public setMovedOutTenantsToUsers = () =>
    this.userDao.getUsersBy({ user_type: USER_TYPE.TENANT }).then(tenants =>
      Promise.all(
        tenants && tenants.length > 0 ? tenants.map(({ iduser }) =>
          this.contractDao.getContractsBy({ iduser, status: [CONTRACT_STATUS.ACTIVE, CONTRACT_STATUS.TERMINATED] })
            .then(contracts => {
              if (!contracts || contracts.length === 0 ||
                contracts.some(contract => contract.status === CONTRACT_STATUS.ACTIVE)) {
                return []
              }

              if (contracts.every(contract => Date.parse(contract.end_date) < Date.now())) {
                return this.userDao.updateUserBy({ iduser }, { user_type: USER_TYPE.LIGHT })
              }
              return []
            })
        ) : []
      )
    )
}
