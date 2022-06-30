import { Authentication } from './authentication'

const AuthenticationService = new Authentication()

export const signInBackOffice = (id, clientId, facadeIds, chatToken, authType) =>
  AuthenticationService.sign({ id, clientId, facadeIds, chatToken, authType })

export const signInCommunity = (id, authType, expiresIn = '6h') =>
  AuthenticationService.sign({ id, authType }, expiresIn)

export const signInTenant = (id, projectId, apartmentId, chatToken, authType) =>
  AuthenticationService.sign({ id, projectId, apartmentId, chatToken, authType }, '30d')

export const signWithEmail = email => AuthenticationService.sign({ email })

export const signShareRoomInvitation = (inviter, invitee_id) => {
  const { first_name, img_url, iduser: inviter_id } = inviter
  return AuthenticationService.sign({ first_name, img_url, invitee_id, inviter_id }, '6d')
}

export const signInGuest = authType => AuthenticationService.sign({ authType })

export const verify = token => AuthenticationService.verify(token)
