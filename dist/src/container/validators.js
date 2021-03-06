"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const address_1 = require("../application/middleware/validator/address");
const admin_1 = require("../application/middleware/validator/admin");
const admins_1 = require("../application/middleware/validator/admins");
const apartment_1 = require("../application/middleware/validator/apartment");
const application_1 = require("../application/middleware/validator/application");
const member_1 = require("../application/middleware/validator/member");
const members_1 = require("../application/middleware/validator/members");
const memberTags_1 = require("../application/middleware/validator/memberTags");
const contract_1 = require("../application/middleware/validator/contract");
const contractTemplates_1 = require("../application/middleware/validator/contractTemplates");
const emergencyContact_1 = require("../application/middleware/validator/emergencyContact");
const incidentReport_1 = require("../application/middleware/validator/incidentReport");
const job_1 = require("../application/middleware/validator/job");
const label_1 = require("../application/middleware/validator/label");
const offer_1 = require("../application/middleware/validator/offer");
const oneflow_1 = require("../application/middleware/validator/oneflow");
const payment_1 = require("../application/middleware/validator/payment");
const project_1 = require("../application/middleware/validator/project");
const projectFacade_1 = require("../application/middleware/validator/projectFacade");
const projectGallery_1 = require("../application/middleware/validator/projectGallery");
const projects_1 = require("../application/middleware/validator/projects");
const room_1 = require("../application/middleware/validator/room");
const rooms_1 = require("../application/middleware/validator/rooms");
const statistics_1 = require("../application/middleware/validator/statistics");
const tenant_1 = require("../application/middleware/validator/tenant");
const typeform_1 = require("../application/middleware/validator/typeform");
const user_1 = require("../application/middleware/validator/user");
const userPreferences_1 = require("../application/middleware/validator/userPreferences");
const userPreferredRoommates_1 = require("../application/middleware/validator/userPreferredRoommates");
const userProfiles_1 = require("../application/middleware/validator/userProfiles");
// Middleware
_1.container
    .bind('createProjectFacadeValidator')
    .to(projectFacade_1.CreateProjectFacadeValidator);
_1.container
    .bind('updateProjectFacadeValidator')
    .to(projectFacade_1.UpdateProjectFacadeValidator);
_1.container
    .bind('getProjectFacadesValidator')
    .to(projectFacade_1.GetProjectFacadesValidator);
_1.container
    .bind('parameterFacadeIdValidator')
    .to(projectFacade_1.ParameterFacadeIdValidator);
_1.container
    .bind('createApplicationValidator')
    .to(application_1.CreateApplicationValidator);
_1.container
    .bind('deleteApplicationValidator')
    .to(application_1.DeleteApplicationValidator);
_1.container
    .bind('countApplicationValidator')
    .to(application_1.CountApplicationValidator);
_1.container
    .bind('getInterestedMembersValidator')
    .to(members_1.GetInterestedMembersValidator);
_1.container
    .bind('getPendingOfferMembersValidator')
    .to(members_1.GetPendingOfferMembersValidator);
_1.container
    .bind('getContractMembersValidator')
    .to(members_1.GetContractMembersValidator);
_1.container
    .bind('getMemberValidator')
    .to(member_1.GetMemberValidator);
_1.container
    .bind('getMemberNotesValidator')
    .to(member_1.GetMemberNotesValidator);
_1.container
    .bind('getMemberPreferencesValidator')
    .to(member_1.GetMemberPreferencesValidator);
_1.container
    .bind('getMemberProfileValidator')
    .to(member_1.GetMemberProfileValidator);
_1.container
    .bind('getMemberSubscriptionsValidator')
    .to(member_1.GetMemberSubscriptionsValidator);
_1.container
    .bind('getMemberWishedRoomiesValidator')
    .to(member_1.GetMemberWishedRoomiesValidator);
_1.container
    .bind('createMemberNotesValidator')
    .to(member_1.CreateMemberNotesValidator);
_1.container
    .bind('updateMemberNotesValidator')
    .to(member_1.UpdateMemberNotesValidator);
_1.container
    .bind('getSubscribedMembersValidator')
    .to(member_1.GetSubscribedMembersValidator);
_1.container
    .bind('createRoomValidator')
    .to(room_1.CreateRoomValidator);
_1.container
    .bind('deleteRoomsValidator')
    .to(room_1.DeleteRoomsValidator);
_1.container
    .bind('parameterRoomIdValidator')
    .to(room_1.ParameterRoomIdValidator);
_1.container
    .bind('updateRoomValidator')
    .to(room_1.UpdateRoomValidator);
_1.container
    .bind('getRoomAndTenantsValidator')
    .to(room_1.GetRoomAndTenantsValidator);
_1.container
    .bind('getRoomsValidator')
    .to(rooms_1.GetRoomsValidator);
_1.container
    .bind('createContractValidator')
    .to(contract_1.CreateContractValidator);
_1.container
    .bind('getContractsByIduserValidator')
    .to(contract_1.GetContractsByIduserValidator);
_1.container
    .bind('getContractTemplateByCollectionIdValidator')
    .to(contractTemplates_1.GetContractTemplateByCollectionIdValidator);
_1.container
    .bind('getContractTemplateByFacadeIdValidator')
    .to(contractTemplates_1.GetContractTemplateByFacadeIdValidator);
_1.container
    .bind('getContractPdfValidator')
    .to(contract_1.GetContractPdfValidator);
_1.container
    .bind('updateContractByIdValidator')
    .to(contract_1.UpdateContractByIdValidator);
_1.container
    .bind('updateContractTemplateByFacadeIdValidator')
    .to(contractTemplates_1.UpdateContractTemplateByFacadeIdValidator);
_1.container
    .bind('deleteContractValidator')
    .to(contract_1.DeleteContractValidator);
_1.container
    .bind('createUserValidator')
    .to(user_1.CreateUserValidator);
_1.container
    .bind('getOtherUserCountValidator')
    .to(user_1.GetOtherUserCountValidator);
_1.container
    .bind('getOtherUsersValidator')
    .to(user_1.GetOtherUsersValidator);
_1.container
    .bind('updateUserValidator')
    .to(user_1.UpdateUserValidator);
_1.container
    .bind('loginUserValidator')
    .to(user_1.LoginUserValidator);
_1.container
    .bind('findOtherUserValidator')
    .to(user_1.FindOtherUserValidator);
_1.container
    .bind('uploadUserProfileImageValidator')
    .to(user_1.UploadUserProfileImageValidator);
_1.container
    .bind('setPasswordValidator')
    .to(user_1.SetPasswordValidator);
_1.container
    .bind('sendPinCodeValidator')
    .to(user_1.SendPinCodeValidator);
_1.container
    .bind('verifyPinCodeValidator')
    .to(user_1.VerifyPinCodeValidator);
_1.container
    .bind('createAdminValidator')
    .to(admin_1.CreateAdminValidator);
_1.container
    .bind('updateAdminValidator')
    .to(admin_1.UpdateAdminValidator);
_1.container
    .bind('getAdminsValidator')
    .to(admins_1.GetAdminsValidator);
_1.container
    .bind('deleteAdminValidator')
    .to(admin_1.DeleteAdminValidator);
_1.container
    .bind('updateAdminImageValidator')
    .to(admin_1.UpdateAdminImageValidator);
_1.container
    .bind('loginAdminValidator')
    .to(admin_1.LoginAdminValidator);
_1.container
    .bind('setAdminPasswordValidator')
    .to(admin_1.SetAdminPasswordValidator);
_1.container
    .bind('verifyCodeValidator')
    .to(admin_1.VerifyCodeValidator);
_1.container
    .bind('resendEmailValidator')
    .to(admin_1.ResendEmailValidator);
_1.container
    .bind('forgotPasswordValidator')
    .to(admin_1.ForgotPasswordValidator);
_1.container
    .bind('createAddressValidator')
    .to(address_1.CreateAddressValidator);
_1.container
    .bind('updateAddressValidator')
    .to(address_1.UpdateAddressValidator);
_1.container
    .bind('deleteAddressValidator')
    .to(address_1.DeleteAddressValidator);
_1.container
    .bind('getTenantsValidator')
    .to(tenant_1.GetTenantsValidator);
_1.container
    .bind('getOtherTenantValidator')
    .to(tenant_1.GetOtherTenantValidator);
_1.container
    .bind('loginTenantValidator')
    .to(tenant_1.LoginTenantValidator);
_1.container
    .bind('createEmergencyContactValidator')
    .to(emergencyContact_1.CreateEmergencyContactValidator);
_1.container
    .bind('updateEmergencyContactValidator')
    .to(emergencyContact_1.UpdateEmergencyContactValidator);
_1.container
    .bind('createIncidentReportValidator')
    .to(incidentReport_1.CreateIncidentReportValidator);
_1.container
    .bind('createIncidentReportByTenantValidator')
    .to(incidentReport_1.CreateIncidentReportByTenantValidator);
_1.container
    .bind('getIncidentReportForAdminValidator')
    .to(incidentReport_1.GetIncidentReportForAdminValidator);
_1.container
    .bind('getIncidentReportForTenantValidator')
    .to(incidentReport_1.GetIncidentReportForTenantValidator);
_1.container
    .bind('getIncidentReportsForAdminValidator')
    .to(incidentReport_1.GetIncidentReportsForAdminValidator);
_1.container
    .bind('getIncidentReportsForTenantValidator')
    .to(incidentReport_1.GetIncidentReportsForTenantValidator);
_1.container
    .bind('updateIncidentReportByAdminValidator')
    .to(incidentReport_1.UpdateIncidentReportByAdminValidator);
_1.container
    .bind('updateIncidentReportByTenantValidator')
    .to(incidentReport_1.UpdateIncidentReportByTenantValidator);
_1.container
    .bind('deleteIncidentPhotoValidator')
    .to(incidentReport_1.DeleteIncidentPhotoValidator);
_1.container
    .bind('createLabelValidator')
    .to(label_1.CreateLabelValidator);
_1.container
    .bind('updateLabelValidator')
    .to(label_1.UpdateLabelValidator);
_1.container
    .bind('createMemberTagValidator')
    .to(memberTags_1.CreateMemberTagValidator);
_1.container
    .bind('updateMemberTagValidator')
    .to(memberTags_1.UpdateMemberTagValidator);
_1.container
    .bind('createProjectValidator')
    .to(project_1.CreateProjectValidator);
_1.container
    .bind('updateProjectValidator')
    .to(project_1.UpdateProjectValidator);
_1.container
    .bind('getProjectByFacadeIdValidator')
    .to(project_1.GetProjectByFacadeIdValidator);
_1.container
    .bind('publishedProjectValidator')
    .to(project_1.PublishedProjectValidator);
_1.container
    .bind('getPublishedProjectsValidator')
    .to(project_1.GetPublishedProjectsValidator);
_1.container
    .bind('uploadProjectImageValidator')
    .to(project_1.UploadProjectImageValidator);
_1.container
    .bind('deleteProjectValidator')
    .to(project_1.DeleteProjectValidator);
_1.container
    .bind('createProjectGalleryValidator')
    .to(projectGallery_1.CreateProjectGalleryValidator);
_1.container
    .bind('updateProjectGalleryValidator')
    .to(projectGallery_1.UpdateProjectGalleryValidator);
_1.container
    .bind('getProjectsValidator')
    .to(projects_1.GetProjectsValidator);
_1.container
    .bind('sendInvitationValidator')
    .to(userPreferredRoommates_1.SendInvitationValidator);
_1.container
    .bind('replyInvitationValidator')
    .to(userPreferredRoommates_1.ReplyInvitationValidator);
_1.container
    .bind('deletePreferredRoommateValidator')
    .to(userPreferredRoommates_1.DeletePreferredRoommateValidator);
_1.container
    .bind('connectPreferredRoommateValidator')
    .to(userPreferredRoommates_1.ConnectPreferredRoommateValidator);
_1.container
    .bind('updateUserProfileValidator')
    .to(userProfiles_1.UpdateUserProfileValidator);
_1.container
    .bind('createApartmentValidator')
    .to(apartment_1.CreateApartmentValidator);
_1.container
    .bind('updateApartmentValidator')
    .to(apartment_1.UpdateApartmentValidator);
_1.container
    .bind('deleteApartmentValidator')
    .to(apartment_1.DeleteApartmentValidator);
_1.container
    .bind('acceptOfferValidator')
    .to(offer_1.AcceptOfferValidator);
_1.container
    .bind('rejectOfferValidator')
    .to(offer_1.RejectOfferValidator);
_1.container
    .bind('requestOfferValidator')
    .to(offer_1.RequestOfferValidator);
_1.container
    .bind('requestManualValidator')
    .to(offer_1.RequestManualValidator);
_1.container
    .bind('getOffersForAdminValidator')
    .to(offer_1.GetOffersForAdminValidator);
_1.container
    .bind('sendOffersToSelectedMembersValidator')
    .to(offer_1.SendOffersToSelectedMembersValidator);
_1.container
    .bind('updateUserPreferencesValidator')
    .to(userPreferences_1.UpdateUserPreferencesValidator);
_1.container
    .bind('typeformResponseValidator')
    .to(typeform_1.TypeformResponseValidator);
_1.container
    .bind('getApplicationsStatsByDateRangeValidator')
    .to(statistics_1.GetApplicationsStatsByDateRangeValidator);
_1.container
    .bind('getRegistrationsStatsByDateRangeValidator')
    .to(statistics_1.GetRegistrationsStatsByDateRangeValidator);
_1.container
    .bind('getOffersStatsByDateRangeValidator')
    .to(statistics_1.GetOffersStatsByDateRangeValidator);
_1.container
    .bind('getStatsByDateRangeValidator')
    .to(statistics_1.GetStatsByDateRangeValidator);
_1.container
    .bind('oneflowResponseValidator')
    .to(oneflow_1.OneflowResponseValidator);
_1.container
    .bind('createChargeValidator')
    .to(payment_1.CreateChargeValidator);
_1.container
    .bind('getPaymentsForAdminValidator')
    .to(payment_1.GetPaymentsForAdminValidator);
_1.container
    .bind('getPaymentForTenantValidator')
    .to(payment_1.GetPaymentForTenantValidator);
_1.container
    .bind('stripeResponseValidator')
    .to(payment_1.StripeResponseValidator);
_1.container
    .bind('createMonthlyRentValidator')
    .to(job_1.CreateMonthlyRentValidator);
//# sourceMappingURL=validators.js.map