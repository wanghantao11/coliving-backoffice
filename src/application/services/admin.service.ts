import 'reflect-metadata'
import { inject, injectable } from 'inversify'

import { AdminDao } from './../../domain/dao'
import { Admin } from './../../domain/entity'
import { BACKOFFICE, SITE_ADMIN, HOST } from './../../infrastructure/constants'
import { hashPassword, checkPassword, excludeKeysFromObject } from './../../infrastructure/utils/common'
import { sendSetPasswordEmail } from './../../infrastructure/utils/email'
import { signWithEmail, verify, signInBackOffice } from './../auth/jwt/service'
import { createChatToken } from './../getstream/chat'

@injectable()
export class AdminService {
  constructor(
    @inject('AdminDao') private adminDao: AdminDao
  ) {}

  public createAdmin = (admin: Admin) => this.adminDao.createAdmin(admin)

  public deleteAdmin = (id: string) => this.adminDao.deleteAdmin(Number(id))

  public getAdminById = (id: number) => this.adminDao.getAdminBy({ id })
    .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by id ${id}` }) : admin)
    .then(excludeKeysFromObject('password'))

  public login = (email: string, password: string): Promise<string> =>
    this.adminDao.getAdminBy({ email })
      .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : admin)
      .then(admin => !admin.verified ?
        Promise.reject({ message: 'NOT_VERIFIED', reason: `Admin ${email} is not verified` })
        : checkPassword(password, admin.password)
          .then(isVerified =>
            isVerified
              ? createChatToken(`host-${admin.id}`).then(chatToken => signInBackOffice(admin.id, admin.client.id, admin.facade_ids, chatToken, BACKOFFICE))
              : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for admin ${email}` })
          )
      )

  public getAdminsByClientId = (client_id: number) =>
    this.adminDao.getAdminsBy({ client_id })

  public getDefaultHostAdminByFacadeId = (facadeId: number) =>
    this.getHostsOrSiteAdminsByFacadeId(facadeId)
      .then(hosts => hosts.length === 0 ? Promise.reject({ message: 'NOT_FOUND', reason: `No host is found in project facade ${facadeId}` }) : hosts[0])

  public getHostsOrSiteAdminsByFacadeId = (facadeId: number) =>
    this.adminDao.getAdminsBy({ roles: [SITE_ADMIN.name, HOST.name], facadeIds: [facadeId], verified: true })

  public setPasswordById = (id: number, password: string) =>
    hashPassword(password).then(hashedPassword => this.adminDao.updateAdminBy({ id }, { password: hashedPassword, verified: true, verification_code: null }))

  public sendForgotPasswordEmail = (email: string) =>
    this.adminDao.getAdminBy({ email })
      .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : signWithEmail(email))
      .then(code => sendSetPasswordEmail(email, code, process.env.BACKOFFICE_FRONTEND, '/mail/admin/forgot-password')
        .then(() => code))

  public sendVerificationEmail = (email: string) =>
    this.adminDao.getAdminBy({ email })
      .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : signWithEmail(email))
      .then(code => sendSetPasswordEmail(email, code, process.env.BACKOFFICE_FRONTEND, '/mail/admin/verify')
        .then(() => code))

  public verify = (verificationCode: string) =>
    verify(verificationCode)
      .then(({ email }: any) => this.adminDao.getAdminBy({ email }))
      .then(admin =>
        !admin.verification_code
          ? Promise.reject({ message: 'NOT_VERIFIED', reason: 'Verification failed with incorrect code' })
          : admin.id)

  public setCodeByEmail = (email: string, code: string) => this.adminDao.updateAdminBy({ email }, { verification_code: code })

  public updateAdminById = (id: string, updateObj: Partial<Admin>) => this.adminDao.updateAdminBy({ id: Number(id) }, updateObj)
}
