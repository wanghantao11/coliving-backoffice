import { Contract, Offer, ProjectFacade, User, Client, UserPreferredRoommates } from './../entity'

export interface TransactionDao {
  createProjectFacadeWithBillingAndTemplates(projectFacade: ProjectFacade)
  updateRoomAndOfferStatusAndUserType(offer: Offer, idusers: string[])
  createUserWithPreferencesAndProfiles(user: User): Promise<User>
  updateContractsAndRelatedInfoAfterRejection(contracts: Contract[])
  updateContractsAndRelatedInfoAfterSigning(contracts: Contract[])
  updateContractAndRelatedInfoAfterApproveTenant(contract: Contract)
  createClientAndRoles(client: Client)
  acceptPreferredRommmateInvitation(userPreferredRoommate: Partial<UserPreferredRoommates>)
  connectPreferredRoommate(userPreferredRoommate: Partial<UserPreferredRoommates>, invitee_user_key: number)
}
