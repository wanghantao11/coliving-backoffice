import { container } from '.'
import { AddressService } from '../application/services/address.service'
import { AdminService } from '../application/services/admin.service'
import { ApartmentService } from '../application/services/apartment.service'
import { ApplicationService } from '../application/services/application.service'
import { ClientService } from '../application/services/client.service'
import { ContractService } from '../application/services/contract.service'
import { EmergencyContactsService } from '../application/services/emergencyContacts.service'
import { IncidentReportService } from '../application/services/incidentReport.service'
import { InterestsService } from '../application/services/interests.service'
import { LabelService } from '../application/services/label.service'
import { MemberService } from '../application/services/member.service'
import { MembersService } from '../application/services/members.service'
import { MemberTagsService } from '../application/services/memberTags.service'
import { ProjectGalleryService } from '../application/services/projectGallery.service'
import { ProjectService } from '../application/services/project.service'
import { ProjectFacadeService } from '../application/services/projectFacade.service'
import { ProjectFacadeBillingService } from '../application/services/projectFacadeBilling.service'
import { RoleService } from '../application/services/role.service'
import { RoomService } from '../application/services/room.service'
import { TenantService } from '../application/services/tenant.service'
import { UserPreferencesService } from '../application/services/userPreferences.service'
import { UserProfilesService } from '../application/services/userProfiles.service'
import { UserService } from '../application/services/user.service'
import { OfferService } from '../application/services/offer.service'
import { UserScoreService } from '../application/services/userScore.service'
import { StatisticsService } from '../application/services/statistics.service'
import { ContractTemplatesService } from '../application/services/contractTemplates.service'
import { PaymentService } from '../application/services/payment.service'

container.bind<AddressService>('AddressService').to(AddressService)
container.bind<AdminService>('AdminService').to(AdminService)
container.bind<ApartmentService>('ApartmentService').to(ApartmentService)
container.bind<ApplicationService>('ApplicationService').to(ApplicationService)
container.bind<ClientService>('ClientService').to(ClientService)
container.bind<ContractService>('ContractService').to(ContractService)
container.bind<EmergencyContactsService>('EmergencyContactsService').to(EmergencyContactsService)
container.bind<IncidentReportService>('IncidentReportService').to(IncidentReportService)
container.bind<InterestsService>('InterestsService').to(InterestsService)
container.bind<LabelService>('LabelService').to(LabelService)
container.bind<MemberService>('MemberService').to(MemberService)
container.bind<MembersService>('MembersService').to(MembersService)
container.bind<MemberTagsService>('MemberTagsService').to(MemberTagsService)
container.bind<ProjectService>('ProjectService').to(ProjectService)
container.bind<ProjectFacadeService>('ProjectFacadeService').to(ProjectFacadeService)
container.bind<ProjectFacadeBillingService>('ProjectFacadeBillingService').to(ProjectFacadeBillingService)
container.bind<ProjectGalleryService>('ProjectGalleryService').to(ProjectGalleryService)
container.bind<RoleService>('RoleService').to(RoleService)
container.bind<RoomService>('RoomService').to(RoomService)
container.bind<TenantService>('TenantService').to(TenantService)
container.bind<UserProfilesService>('UserProfilesService').to(UserProfilesService)
container.bind<UserPreferencesService>('UserPreferencesService').to(UserPreferencesService)
container.bind<UserService>('UserService').to(UserService)
container.bind<OfferService>('OfferService').to(OfferService)
container.bind<UserScoreService>('UserScoreService').to(UserScoreService)
container.bind<StatisticsService>('StatisticsService').to(StatisticsService)
container.bind<ContractTemplatesService>('ContractTemplatesService').to(ContractTemplatesService)
container.bind<PaymentService>('PaymentService').to(PaymentService)
