import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { UserDao, TransactionDao, ContractDao } from './../../domain/dao'
import { User } from './../../domain/entity'
import {
  COMMUNITY, CONTRACT_STATUS, TAG_STATUS, EVENT_MAILCHIMP_TAGS,
  PIN_CODE_SIZE, PIN_CODE_EXPIRE_TIME
} from './../../infrastructure/constants'
import { checkPassword, hashPassword, createRandomCode } from './../../infrastructure/utils/common'
import { sendSetPasswordEmail, emailAxiosPost, sendPinCodeEmail } from './../../infrastructure/utils/email'
import { deleteContract } from '../../infrastructure/utils/contract'
import {
  checkForMissingLocation,
  convertAgeToBirthday,
  otherUserMapping
} from './../../infrastructure/utils/user'
import { signInCommunity, signWithEmail, verify } from './../auth/jwt/service'
import { signInWithEmailAndPassword } from './../firebase/user'
import { excludeKeysFromObject } from './../../infrastructure/utils/common'
import { logger, contractEventLogger } from '../../infrastructure/utils/loggers'
import { formatUser, importUser, updateUser, archiveUser, updateUserTags } from '../../infrastructure/utils/mailchimp'
import { redisClient, getAsync as get } from '../../infrastructure/persistence/redis'

@injectable()
export class UserService {
  constructor(
    @inject('UserDao') private userDao: UserDao,
    @inject('TransactionDao') private transaticonDao: TransactionDao,
    @inject('ContractDao') private contractDao: ContractDao
  ) {}

  public createUser = (user: User) =>
    User.generateUser(user)
      .then(user =>
        this.userDao.getUserBy({ email: user.email, is_verified: null })
          .then(storedUser => {
            if (storedUser && storedUser.is_verified) {
              return Promise.reject({ message: 'CONFLICT', reason: `User ${storedUser.email} existed already` })
            }
            if (storedUser && !storedUser.is_verified) {
              return this.userDao.updateUserBy(
                { email: user.email, is_verified: false },
                { ...excludeKeysFromObject('iduser', 'captcha')(user), is_verified: true })
            }
            if (!storedUser) {
              return this.transaticonDao.createUserWithPreferencesAndProfiles(user)
            }
          })
          .then(() => formatUser(user))
          .then(importUser(process.env.MAILCHIMP_LIST_ID))
          .then(() =>
            emailAxiosPost('/mail/new-user', {
              email: user.email,
              name: user.first_name,
            }).catch(error =>
              logger.info(`Failed to send welcome emails. Reason: ${error.message}`)
            )
          )
      )

  public deleteUserByExternalId = (iduser: string) =>
    this.contractDao.getContractBy({ iduser })
      .then(contract => {
        if (contract) {
          if (contract.status === CONTRACT_STATUS.PENDING) {
            return this.contractDao.getContractsBy({ externalId: contract.external_id, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })
              .then(this.transaticonDao.updateContractsAndRelatedInfoAfterRejection)
              .then(() => contractEventLogger.info({
                type: 'contract_rejected',
                data: { contract, reason: 'account_deleted' },
                iduser,
                facade_id: contract.facade_id,
              }))
              .then(() => deleteContract(contract.external_id))
          } else {
            return Promise.reject({ message: 'NOT_ALLOWED', reason: `Non-pending contract is found for user ${iduser}` })
          }
        } else {
          return null
        }
      })
      .then(() => this.userDao.deleteUserByExternalId(iduser))
      .then(({ email: email_address }) => archiveUser(process.env.MAILCHIMP_LIST_ID)({ email_address }))

  public findMeByExternalId = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : user)
      .then(excludeKeysFromObject('password', 'user_key'))

  public findUserByExternalId = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : user)
      .then(excludeKeysFromObject('phone', 'email', 'registration_time', 'password', 'user_key'))

  public getOtherUsers = (iduser: string, data: any) => {
    const { minAge, maxAge, locations, offset, limit } = data
    let query = { offset, limit, exclude: [iduser] }
    if (minAge && maxAge) {
      if (Number(minAge) !== 18 || Number(maxAge) !== 100) {
        const maxBirthday = convertAgeToBirthday(minAge)
        const minBirthday = convertAgeToBirthday(maxAge)
        const ageSpan = { maxBirthday, minBirthday }
        query = Object.assign(query, { ageSpan })
      }
    }
    if (locations) {
      query = Object.assign(query, { locations: checkForMissingLocation(locations) })
    }
    return this.userDao.getUsersBy(query)
      .then(otherUserMapping)
  }

  public getUserCount = (iduser: string, data: any) => {
    const { minAge, maxAge, locations } = data
    let query = { exclude: [iduser] }
    if (minAge && maxAge) {
      if (Number(minAge) !== 18 || Number(maxAge) !== 100) {
        const maxBirthday = convertAgeToBirthday(minAge)
        const minBirthday = convertAgeToBirthday(maxAge)
        const ageSpan = { maxBirthday, minBirthday }
        query = Object.assign(query, { ageSpan })
      }
    }
    if (locations) {
      query = Object.assign(query, { locations: checkForMissingLocation(locations) })
    }
    return this.userDao.getUsersCountBy(query)
  }

  public updateUserByExternalId = (iduser: string, data: Partial<User>) =>
    this.userDao.updateUserBy({ iduser }, data)
      .then(user => (
        data.birthday && updateUser(process.env.MAILCHIMP_LIST_ID)(formatUser(user)),
        data.is_test_complete && updateUserTags(process.env.MAILCHIMP_LIST_ID)(formatUser(user)),
        user))

  /**
   * NOTE:
   * If no password in db, authenticate with firebase first and hash the password, store it in db,
   * otherwise, check the password with hashed one and login
   *
   * For backward compatibility with firebase auth
   */
  public login = (email: string, password: string) =>
    this.userDao.getUserBy({ email: email.toLowerCase() })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : user)
      .then(user =>
        !user.password ?
          signInWithEmailAndPassword(email, password).then(() => hashPassword(password))
            .then(hashedPassword => this.userDao.updateUserBy({ iduser: user.iduser }, { password: hashedPassword })
              .then(updatedUser => signInCommunity(updatedUser.iduser, COMMUNITY))
            )
          : checkPassword(password, user.password).then(isVerified =>
            isVerified
              ? signInCommunity(user.iduser, COMMUNITY)
              : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for user ${email}` })
          ))

  public sendVerificationEmail = (email: string) =>
    this.userDao.getUserBy({ email })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : signWithEmail(email))
      .then(code => sendSetPasswordEmail(email, code, process.env.COMMUNITY_FRONTEND, '/mail/user/verify')
        .then(() => code))

  public setCodeByEmail = (email: string, code: string) => this.userDao.updateUserBy({ email }, { verification_code: code })

  public verify = (verificationCode: string) =>
    verify(verificationCode)
      .then(({ email }: any) => this.userDao.getUserBy({ email }))
      .then(user =>
        user.verification_code !== verificationCode
          ? Promise.reject({ message: 'NOT_VERIFIED', reason: 'Verification failed with incorrect code' })
          : user.iduser)

  public setPasswordById = (iduser: string, password: string) =>
    hashPassword(password)
      .then(hashedPassword => this.userDao.updateUserBy({ iduser }, { password: hashedPassword, verification_code: null }))

  public setRoomieTestStartedTagOnMailchimp = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(({ email: email_address }) =>
        updateUserTags(process.env.MAILCHIMP_LIST_ID)({ email_address, tags: [{ name: EVENT_MAILCHIMP_TAGS.ROOMIE_TEST_STARTED, status: TAG_STATUS.ACTIVE }] }))

  public sendPincode = (email: string) =>
    this.userDao.getUserBy({ email, is_verified: null })
      .then(user => !user || !user.is_verified ? Promise.resolve(createRandomCode({ size: PIN_CODE_SIZE }))
        .then(code => (
          redisClient.setex(email, PIN_CODE_EXPIRE_TIME, code),
          sendPinCodeEmail({ email, code })))
        : Promise.reject({ message: 'CONFLICT', reason: `User ${email} existed already` }))

  public verifyPincode = (email: string, code: string) => Promise.resolve(get(email))
    .then(storedCode => storedCode === code)
    .then(isVerified => !isVerified ? Promise.reject({ message: 'NOT_VERIFIED', reason: `PIN code not correct for email ${email}` }) : redisClient.del(email))
}
