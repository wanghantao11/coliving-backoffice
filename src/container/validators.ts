import { container } from '.'

import {
  CreateAddressValidator,
  UpdateAddressValidator,
  DeleteAddressValidator
} from '../application/middleware/validator/address'
import {
  CreateAdminValidator,
  UpdateAdminValidator,
  ResendEmailValidator,
  LoginAdminValidator,
  SetAdminPasswordValidator,
  VerifyCodeValidator,
  DeleteAdminValidator,
  UpdateAdminImageValidator,
  ForgotPasswordValidator
} from '../application/middleware/validator/admin'
import { GetAdminsValidator } from '../application/middleware/validator/admins'
import {
  CreateApartmentValidator,
  DeleteApartmentValidator,
  UpdateApartmentValidator
} from '../application/middleware/validator/apartment'
import {
  CreateApplicationValidator,
  DeleteApplicationValidator,
  CountApplicationValidator
} from '../application/middleware/validator/application'
import {
  GetMemberNotesValidator,
  GetMemberPreferencesValidator,
  GetMemberProfileValidator,
  GetMemberSubscriptionsValidator,
  GetMemberWishedRoomiesValidator,
  GetMemberValidator,
  GetSubscribedMembersValidator,
  CreateMemberNotesValidator,
  UpdateMemberNotesValidator
} from '../application/middleware/validator/member'
import {
  GetInterestedMembersValidator,
  GetPendingOfferMembersValidator,
  GetContractMembersValidator
} from '../application/middleware/validator/members'
import {
  CreateMemberTagValidator,
  UpdateMemberTagValidator
} from '../application/middleware/validator/memberTags'
import {
  CreateContractValidator,
  DeleteContractValidator,
  GetContractPdfValidator,
  GetContractsByIduserValidator,
  UpdateContractByIdValidator
} from '../application/middleware/validator/contract'
import {
  GetContractTemplateByCollectionIdValidator,
  GetContractTemplateByFacadeIdValidator,
  UpdateContractTemplateByFacadeIdValidator
} from '../application/middleware/validator/contractTemplates'
import {
  CreateEmergencyContactValidator,
  UpdateEmergencyContactValidator
} from '../application/middleware/validator/emergencyContact'
import {
  CreateIncidentReportValidator,
  CreateIncidentReportByTenantValidator,
  UpdateIncidentReportByAdminValidator,
  UpdateIncidentReportByTenantValidator,
  GetIncidentReportForAdminValidator,
  GetIncidentReportForTenantValidator,
  GetIncidentReportsForAdminValidator,
  GetIncidentReportsForTenantValidator,
  DeleteIncidentPhotoValidator
} from '../application/middleware/validator/incidentReport'
import {
  CreateMonthlyRentValidator
} from '../application/middleware/validator/job'
import {
  CreateLabelValidator,
  UpdateLabelValidator
} from '../application/middleware/validator/label'
import {
  AcceptOfferValidator,
  RejectOfferValidator,
  RequestOfferValidator,
  RequestManualValidator,
  GetOffersForAdminValidator,
  SendOffersToSelectedMembersValidator
} from '../application/middleware/validator/offer'
import {
  OneflowResponseValidator
} from '../application/middleware/validator/oneflow'
import {
  CreateChargeValidator,
  GetPaymentsForAdminValidator,
  GetPaymentForTenantValidator,
  StripeResponseValidator
} from '../application/middleware/validator/payment'
import {
  CreateProjectValidator,
  UpdateProjectValidator,
  GetProjectByFacadeIdValidator,
  PublishedProjectValidator,
  GetPublishedProjectsValidator,
  UploadProjectImageValidator,
  DeleteProjectValidator
} from '../application/middleware/validator/project'
import {
  CreateProjectFacadeValidator,
  GetProjectFacadesValidator,
  ParameterFacadeIdValidator,
  UpdateProjectFacadeValidator
} from '../application/middleware/validator/projectFacade'
import {
  CreateProjectGalleryValidator,
  UpdateProjectGalleryValidator
} from '../application/middleware/validator/projectGallery'
import {
  GetProjectsValidator
} from '../application/middleware/validator/projects'
import {
  CreateRoomValidator,
  DeleteRoomsValidator,
  ParameterRoomIdValidator,
  GetRoomAndTenantsValidator,
  UpdateRoomValidator
} from '../application/middleware/validator/room'
import {
  GetRoomsValidator
} from '../application/middleware/validator/rooms'
import {
  GetApplicationsStatsByDateRangeValidator,
  GetRegistrationsStatsByDateRangeValidator,
  GetOffersStatsByDateRangeValidator,
  GetStatsByDateRangeValidator
} from '../application/middleware/validator/statistics'
import {
  GetOtherTenantValidator,
  GetTenantsValidator,
  LoginTenantValidator
} from '../application/middleware/validator/tenant'
import {
  TypeformResponseValidator
} from '../application/middleware/validator/typeform'
import {
  CreateUserValidator,
  GetOtherUserCountValidator,
  GetOtherUsersValidator,
  LoginUserValidator,
  UpdateUserValidator,
  FindOtherUserValidator,
  UploadUserProfileImageValidator,
  SetPasswordValidator,
  SendPinCodeValidator,
  VerifyPinCodeValidator
} from '../application/middleware/validator/user'
import {
  UpdateUserPreferencesValidator
} from '../application/middleware/validator/userPreferences'
import {
  SendInvitationValidator,
  ReplyInvitationValidator,
  DeletePreferredRoommateValidator,
  ConnectPreferredRoommateValidator
} from '../application/middleware/validator/userPreferredRoommates'

import { UpdateUserProfileValidator} from '../application/middleware/validator/userProfiles'
// Middleware
container
  .bind<CreateProjectFacadeValidator>('createProjectFacadeValidator')
  .to(CreateProjectFacadeValidator)
container
  .bind<UpdateProjectFacadeValidator>('updateProjectFacadeValidator')
  .to(UpdateProjectFacadeValidator)
container
  .bind<GetProjectFacadesValidator>('getProjectFacadesValidator')
  .to(GetProjectFacadesValidator)
container
  .bind<ParameterFacadeIdValidator>('parameterFacadeIdValidator')
  .to(ParameterFacadeIdValidator)
container
  .bind<CreateApplicationValidator>('createApplicationValidator')
  .to(CreateApplicationValidator)
container
  .bind<DeleteApplicationValidator>('deleteApplicationValidator')
  .to(DeleteApplicationValidator)
container
  .bind<CountApplicationValidator>('countApplicationValidator')
  .to(CountApplicationValidator)
container
  .bind<GetInterestedMembersValidator>('getInterestedMembersValidator')
  .to(GetInterestedMembersValidator)
container
  .bind<GetPendingOfferMembersValidator>('getPendingOfferMembersValidator')
  .to(GetPendingOfferMembersValidator)
container
  .bind<GetContractMembersValidator>('getContractMembersValidator')
  .to(GetContractMembersValidator)
container
  .bind<GetMemberValidator>('getMemberValidator')
  .to(GetMemberValidator)
container
  .bind<GetMemberNotesValidator>('getMemberNotesValidator')
  .to(GetMemberNotesValidator)
container
  .bind<GetMemberPreferencesValidator>('getMemberPreferencesValidator')
  .to(GetMemberPreferencesValidator)
container
  .bind<GetMemberProfileValidator>('getMemberProfileValidator')
  .to(GetMemberProfileValidator)
container
  .bind<GetMemberSubscriptionsValidator>('getMemberSubscriptionsValidator')
  .to(GetMemberSubscriptionsValidator)
container
  .bind<GetMemberWishedRoomiesValidator>('getMemberWishedRoomiesValidator')
  .to(GetMemberWishedRoomiesValidator)
container
  .bind<CreateMemberNotesValidator>('createMemberNotesValidator')
  .to(CreateMemberNotesValidator)
container
  .bind<UpdateMemberNotesValidator>('updateMemberNotesValidator')
  .to(UpdateMemberNotesValidator)
container
  .bind<GetSubscribedMembersValidator>('getSubscribedMembersValidator')
  .to(GetSubscribedMembersValidator)
container
  .bind<CreateRoomValidator>('createRoomValidator')
  .to(CreateRoomValidator)
container
  .bind<DeleteRoomsValidator>('deleteRoomsValidator')
  .to(DeleteRoomsValidator)
container
  .bind<ParameterRoomIdValidator>('parameterRoomIdValidator')
  .to(ParameterRoomIdValidator)
container
  .bind<UpdateRoomValidator>('updateRoomValidator')
  .to(UpdateRoomValidator)
container
  .bind<GetRoomAndTenantsValidator>('getRoomAndTenantsValidator')
  .to(GetRoomAndTenantsValidator)
container
  .bind<GetRoomsValidator>('getRoomsValidator')
  .to(GetRoomsValidator)
container
  .bind<CreateContractValidator>('createContractValidator')
  .to(CreateContractValidator)
container
  .bind<GetContractsByIduserValidator>('getContractsByIduserValidator')
  .to(GetContractsByIduserValidator)
container
  .bind<GetContractTemplateByCollectionIdValidator>('getContractTemplateByCollectionIdValidator')
  .to(GetContractTemplateByCollectionIdValidator)
container
  .bind<GetContractTemplateByFacadeIdValidator>('getContractTemplateByFacadeIdValidator')
  .to(GetContractTemplateByFacadeIdValidator)
container
  .bind<GetContractPdfValidator>('getContractPdfValidator')
  .to(GetContractPdfValidator)
container
  .bind<UpdateContractByIdValidator>('updateContractByIdValidator')
  .to(UpdateContractByIdValidator)
container
  .bind<UpdateContractTemplateByFacadeIdValidator>('updateContractTemplateByFacadeIdValidator')
  .to(UpdateContractTemplateByFacadeIdValidator)
container
  .bind<DeleteContractValidator>('deleteContractValidator')
  .to(DeleteContractValidator)
container
  .bind<CreateUserValidator>('createUserValidator')
  .to(CreateUserValidator)
container
  .bind<GetOtherUserCountValidator>('getOtherUserCountValidator')
  .to(GetOtherUserCountValidator)
container
  .bind<GetOtherUsersValidator>('getOtherUsersValidator')
  .to(GetOtherUsersValidator)
container
  .bind<UpdateUserValidator>('updateUserValidator')
  .to(UpdateUserValidator)
container
  .bind<LoginUserValidator>('loginUserValidator')
  .to(LoginUserValidator)
container
  .bind<FindOtherUserValidator>('findOtherUserValidator')
  .to(FindOtherUserValidator)
container
  .bind<UploadUserProfileImageValidator>('uploadUserProfileImageValidator')
  .to(UploadUserProfileImageValidator)
container
  .bind<SetPasswordValidator>('setPasswordValidator')
  .to(SetPasswordValidator)
container
  .bind<SendPinCodeValidator>('sendPinCodeValidator')
  .to(SendPinCodeValidator)
container
  .bind<VerifyPinCodeValidator>('verifyPinCodeValidator')
  .to(VerifyPinCodeValidator)
container
  .bind<CreateAdminValidator>('createAdminValidator')
  .to(CreateAdminValidator)
container
  .bind<UpdateAdminValidator>('updateAdminValidator')
  .to(UpdateAdminValidator)
container
  .bind<GetAdminsValidator>('getAdminsValidator')
  .to(GetAdminsValidator)
container
  .bind<DeleteAdminValidator>('deleteAdminValidator')
  .to(DeleteAdminValidator)
container
  .bind<UpdateAdminImageValidator>('updateAdminImageValidator')
  .to(UpdateAdminImageValidator)
container
  .bind<LoginAdminValidator>('loginAdminValidator')
  .to(LoginAdminValidator)
container
  .bind<SetAdminPasswordValidator>('setAdminPasswordValidator')
  .to(SetAdminPasswordValidator)
container
  .bind<VerifyCodeValidator>('verifyCodeValidator')
  .to(VerifyCodeValidator)
container
  .bind<ResendEmailValidator>('resendEmailValidator')
  .to(ResendEmailValidator)
container
  .bind<ForgotPasswordValidator>('forgotPasswordValidator')
  .to(ForgotPasswordValidator)
container
  .bind<CreateAddressValidator>('createAddressValidator')
  .to(CreateAddressValidator)
container
  .bind<UpdateAddressValidator>('updateAddressValidator')
  .to(UpdateAddressValidator)
container
  .bind<DeleteAddressValidator>('deleteAddressValidator')
  .to(DeleteAddressValidator)
container
  .bind<GetTenantsValidator>('getTenantsValidator')
  .to(GetTenantsValidator)
container
  .bind<GetOtherTenantValidator>('getOtherTenantValidator')
  .to(GetOtherTenantValidator)
container
  .bind<LoginTenantValidator>('loginTenantValidator')
  .to(LoginTenantValidator)
container
  .bind<CreateEmergencyContactValidator>('createEmergencyContactValidator')
  .to(CreateEmergencyContactValidator)
container
  .bind<UpdateEmergencyContactValidator>('updateEmergencyContactValidator')
  .to(UpdateEmergencyContactValidator)
container
  .bind<CreateIncidentReportValidator>('createIncidentReportValidator')
  .to(CreateIncidentReportValidator)
container
  .bind<CreateIncidentReportByTenantValidator>('createIncidentReportByTenantValidator')
  .to(CreateIncidentReportByTenantValidator)
container
  .bind<GetIncidentReportForAdminValidator>('getIncidentReportForAdminValidator')
  .to(GetIncidentReportForAdminValidator)
container
  .bind<GetIncidentReportForTenantValidator>('getIncidentReportForTenantValidator')
  .to(GetIncidentReportForTenantValidator)
container
  .bind<GetIncidentReportsForAdminValidator>('getIncidentReportsForAdminValidator')
  .to(GetIncidentReportsForAdminValidator)
container
  .bind<GetIncidentReportsForTenantValidator>('getIncidentReportsForTenantValidator')
  .to(GetIncidentReportsForTenantValidator)
container
  .bind<UpdateIncidentReportByAdminValidator>('updateIncidentReportByAdminValidator')
  .to(UpdateIncidentReportByAdminValidator)
container
  .bind<UpdateIncidentReportByTenantValidator>('updateIncidentReportByTenantValidator')
  .to(UpdateIncidentReportByTenantValidator)
container
  .bind<DeleteIncidentPhotoValidator>('deleteIncidentPhotoValidator')
  .to(DeleteIncidentPhotoValidator)
container
  .bind<CreateLabelValidator>('createLabelValidator')
  .to(CreateLabelValidator)
container
  .bind<UpdateLabelValidator>('updateLabelValidator')
  .to(UpdateLabelValidator)
container
  .bind<CreateMemberTagValidator>('createMemberTagValidator')
  .to(CreateMemberTagValidator)
container
  .bind<UpdateMemberTagValidator>('updateMemberTagValidator')
  .to(UpdateMemberTagValidator)
container
  .bind<CreateProjectValidator>('createProjectValidator')
  .to(CreateProjectValidator)
container
  .bind<UpdateProjectValidator>('updateProjectValidator')
  .to(UpdateProjectValidator)
container
  .bind<GetProjectByFacadeIdValidator>('getProjectByFacadeIdValidator')
  .to(GetProjectByFacadeIdValidator)
container
  .bind<PublishedProjectValidator>('publishedProjectValidator')
  .to(PublishedProjectValidator)
container
  .bind<GetPublishedProjectsValidator>('getPublishedProjectsValidator')
  .to(GetPublishedProjectsValidator)
container
  .bind<UploadProjectImageValidator>('uploadProjectImageValidator')
  .to(UploadProjectImageValidator)
container
  .bind<DeleteProjectValidator>('deleteProjectValidator')
  .to(DeleteProjectValidator)
container
  .bind<CreateProjectGalleryValidator>('createProjectGalleryValidator')
  .to(CreateProjectGalleryValidator)
container
  .bind<UpdateProjectGalleryValidator>('updateProjectGalleryValidator')
  .to(UpdateProjectGalleryValidator)
container
  .bind<GetProjectsValidator>('getProjectsValidator')
  .to(GetProjectsValidator)
container
  .bind<SendInvitationValidator>('sendInvitationValidator')
  .to(SendInvitationValidator)
container
  .bind<ReplyInvitationValidator>('replyInvitationValidator')
  .to(ReplyInvitationValidator)
container
  .bind<DeletePreferredRoommateValidator>('deletePreferredRoommateValidator')
  .to(DeletePreferredRoommateValidator)
container
  .bind<ConnectPreferredRoommateValidator>('connectPreferredRoommateValidator')
  .to(ConnectPreferredRoommateValidator)
container
  .bind<UpdateUserProfileValidator>('updateUserProfileValidator')
  .to(UpdateUserProfileValidator)
container
  .bind<CreateApartmentValidator>('createApartmentValidator')
  .to(CreateApartmentValidator)
container
  .bind<UpdateApartmentValidator>('updateApartmentValidator')
  .to(UpdateApartmentValidator)
container
  .bind<DeleteApartmentValidator>('deleteApartmentValidator')
  .to(DeleteApartmentValidator)
container
  .bind<AcceptOfferValidator>('acceptOfferValidator')
  .to(AcceptOfferValidator)
container
  .bind<RejectOfferValidator>('rejectOfferValidator')
  .to(RejectOfferValidator)
container
  .bind<RequestOfferValidator>('requestOfferValidator')
  .to(RequestOfferValidator)
container
  .bind<RequestManualValidator>('requestManualValidator')
  .to(RequestManualValidator)
container
  .bind<GetOffersForAdminValidator>('getOffersForAdminValidator')
  .to(GetOffersForAdminValidator)
container
  .bind<SendOffersToSelectedMembersValidator>('sendOffersToSelectedMembersValidator')
  .to(SendOffersToSelectedMembersValidator)
container
  .bind<UpdateUserPreferencesValidator>('updateUserPreferencesValidator')
  .to(UpdateUserPreferencesValidator)
container
  .bind<TypeformResponseValidator>('typeformResponseValidator')
  .to(TypeformResponseValidator)
container
  .bind<GetApplicationsStatsByDateRangeValidator>('getApplicationsStatsByDateRangeValidator')
  .to(GetApplicationsStatsByDateRangeValidator)
container
  .bind<GetRegistrationsStatsByDateRangeValidator>('getRegistrationsStatsByDateRangeValidator')
  .to(GetRegistrationsStatsByDateRangeValidator)
container
  .bind<GetOffersStatsByDateRangeValidator>('getOffersStatsByDateRangeValidator')
  .to(GetOffersStatsByDateRangeValidator)
container
  .bind<GetStatsByDateRangeValidator>('getStatsByDateRangeValidator')
  .to(GetStatsByDateRangeValidator)
container
  .bind<OneflowResponseValidator>('oneflowResponseValidator')
  .to(OneflowResponseValidator)
container
  .bind<CreateChargeValidator>('createChargeValidator')
  .to(CreateChargeValidator)
container
  .bind<GetPaymentsForAdminValidator>('getPaymentsForAdminValidator')
  .to(GetPaymentsForAdminValidator)
container
  .bind<GetPaymentForTenantValidator>('getPaymentForTenantValidator')
  .to(GetPaymentForTenantValidator)
container
  .bind<StripeResponseValidator>('stripeResponseValidator')
  .to(StripeResponseValidator)
container
  .bind<CreateMonthlyRentValidator>('createMonthlyRentValidator')
  .to(CreateMonthlyRentValidator)
