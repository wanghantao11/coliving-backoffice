import { interfaces, TYPE } from 'inversify-express-utils'
import { container } from '.'
import AddressController from '../application/controllers/address.controller'
import AdminController from '../application/controllers/admin.controller'
import AdminsController from '../application/controllers/admins.controller'
import ApartmentController from '../application/controllers/apartment.controller'
import ApplicationController from '../application/controllers/application.controller'
import ClientController from '../application/controllers/client.controller'
import ContractController from '../application/controllers/contract.controller'
import ContractTemplatesController from '../application/controllers/contractTemplates.controller'
import EmergencyContactsController from '../application/controllers/emergencyContacts.controller'
import GetstreamChatController from '../application/controllers/getstreamChat.controller'
import IncidentReportController from '../application/controllers/incidentReport.controller'
import InterestsController from '../application/controllers/interests.controller'
import JobController from '../application/controllers/job.controller'
import LabelController from '../application/controllers/label.controller'
import MemberController from '../application/controllers/member.controller'
import MembersController from '../application/controllers/members.controller'
import MemberTagsController from '../application/controllers/memberTags.controller'
import OfferController from '../application/controllers/offer.controller'
import OfferQueueController from '../application/controllers/offerQueue.controller'
import ProjectController from '../application/controllers/project.controller'
import ProjectFacadeController from '../application/controllers/projectFacade.controller'
import ProjectFacadeBillingController from '../application/controllers/projectFacadeBilling.controller'
import ProjectGalleryController from '../application/controllers/projectGallery.controller'
import ProjectsController from '../application/controllers/projects.controller'
import RoleController from '../application/controllers/role.controller'
import RoomController from '../application/controllers/room.controller'
import RoomAndTenantsController from '../application/controllers/roomAndTenants.controller'
import RoomsController from '../application/controllers/rooms.controller'
import StatisticsController from '../application/controllers/statistics.controller'
import TenantController from '../application/controllers/tenant.controller'
import TenantsController from '../application/controllers/tenants.controller'
import UserController from '../application/controllers/user.controller'
import UserProfilesController from '../application/controllers/userProfiles.controller'
import UserPreferencesController from '../application/controllers/userPreferences.controller'
import WebhookController from '../application/controllers/webhook.controller'
import PaymentController from '../application/controllers/payment.controller'

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(AddressController)
  .whenTargetNamed('Address_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(AdminController)
  .whenTargetNamed('Admin_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(AdminsController)
  .whenTargetNamed('Admins_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ApartmentController)
  .whenTargetNamed('Apartment_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ApplicationController)
  .whenTargetNamed('Application_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ClientController)
  .whenTargetNamed('Client_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ContractController)
  .whenTargetNamed('Contract_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ContractTemplatesController)
  .whenTargetNamed('ContractTemplates_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(EmergencyContactsController)
  .whenTargetNamed('EmergencyContacts_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(GetstreamChatController)
  .whenTargetNamed('Getstream_Chat_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(IncidentReportController)
  .whenTargetNamed('Incident_Report_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(InterestsController)
  .whenTargetNamed('Interests_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(JobController)
  .whenTargetNamed('Job_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(LabelController)
  .whenTargetNamed('Label_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(MemberController)
  .whenTargetNamed('Member_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(MembersController)
  .whenTargetNamed('Members_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(MemberTagsController)
  .whenTargetNamed('MemberTags_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(OfferController)
  .whenTargetNamed('Offer_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(OfferQueueController)
  .whenTargetNamed('Offer_Queue_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ProjectController)
  .whenTargetNamed('Project_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ProjectFacadeController)
  .whenTargetNamed('Project_Facade_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ProjectFacadeBillingController)
  .whenTargetNamed('Project_Facade_Billing_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ProjectGalleryController)
  .whenTargetNamed('Project_Gallery_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(ProjectsController)
  .whenTargetNamed('Projects_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(RoleController)
  .whenTargetNamed('Role_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(RoomController)
  .whenTargetNamed('Room_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(RoomAndTenantsController)
  .whenTargetNamed('Room_And_Tenants_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(RoomsController)
  .whenTargetNamed('Rooms_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(StatisticsController)
  .whenTargetNamed('Statistics_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(TenantController)
  .whenTargetNamed('Tenant_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(TenantsController)
  .whenTargetNamed('Tenants_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(UserController)
  .whenTargetNamed('User_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(UserPreferencesController)
  .whenTargetNamed('UserPreferences_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(UserProfilesController)
  .whenTargetNamed('UserProfiles_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(WebhookController)
  .whenTargetNamed('Webhook_Controller')

container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(PaymentController)
  .whenTargetNamed('Payment_Controller')
