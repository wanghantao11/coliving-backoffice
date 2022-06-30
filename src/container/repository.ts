import { container } from '.'
import {
  AddressDao,
  AdminDao,
  AdminMemberNotesDao,
  ApartmentDao,
  ApplicationDao,
  ClientDao,
  ContractDao,
  ContractEventsDao,
  ContractTemplatesDao,
  EmergencyContactsDao,
  IncidentReportDao,
  InterestsDao,
  LabelDao,
  MemberTagsDao,
  OfferDao,
  OfferEventsDao,
  PaymentDao,
  ProjectDao,
  ProjectFacadeDao,
  ProjectFacadeBillingDao,
  ProjectFacadeDocumentDao,
  ProjectGalleryDao,
  RoleDao,
  RoomDao,
  UserDao,
  UserProfilesDao,
  UserPreferencesDao,
  TenantDao,
  UserPreferredRoommatesDao,
  TransactionDao,
  UserScoreDao
} from '../domain/dao'

import {
  AddressRepository,
  AdminRepository,
  AdminMemberNotesRepository,
  ApartmentRepository,
  ApplicationRepo,
  ClientRepository,
  ContractRepository,
  ContractEventsRepository,
  ContractTemplatesRepository,
  EmergencyContactsRepository,
  IncidentReportRepository,
  InterestsRepository,
  LabelRepository,
  MemberTagsRepository,
  OfferRepository,
  OfferEventsRepository,
  PaymentRepository,
  ProjectFacadeRepository,
  ProjectFacadeBillingRepository,
  ProjectFacadeDocumentRepository,
  ProjectRepository,
  ProjectGalleryRepository,
  RoleRepository,
  RoomRepository,
  UserRepository,
  UserProfilesRepository,
  UserPreferencesRepository,
  TenantRepository,
  UserPreferredRoommatesRepository,
  TransactionRepository,
  UserScoreRepository
} from '../domain/repository'

container.bind<AddressDao>('AddressDao').to(AddressRepository)

container.bind<AdminDao>('AdminDao').to(AdminRepository)

container.bind<AdminMemberNotesDao>('AdminMemberNotesDao').to(AdminMemberNotesRepository)

container.bind<ApartmentDao>('ApartmentDao').to(ApartmentRepository)

container.bind<ApplicationDao>('ApplicationDao').to(ApplicationRepo)

container.bind<ClientDao>('ClientDao').to(ClientRepository)

container.bind<ContractDao>('ContractDao').to(ContractRepository)

container.bind<ContractEventsDao>('ContractEventsDao').to(ContractEventsRepository)

container.bind<ContractTemplatesDao>('ContractTemplatesDao').to(ContractTemplatesRepository)

container.bind<EmergencyContactsDao>('EmergencyContactsDao').to(EmergencyContactsRepository)

container.bind<IncidentReportDao>('IncidentReportDao').to(IncidentReportRepository)

container.bind<InterestsDao>('InterestsDao').to(InterestsRepository)

container.bind<LabelDao>('LabelDao').to(LabelRepository)

container.bind<MemberTagsDao>('MemberTagsDao').to(MemberTagsRepository)

container.bind<OfferDao>('OfferDao').to(OfferRepository)

container.bind<OfferEventsDao>('OfferEventsDao').to(OfferEventsRepository)

container.bind<ProjectDao>('ProjectDao').to(ProjectRepository)

container.bind<ProjectFacadeDao>('ProjectFacadeDao').to(ProjectFacadeRepository)

container.bind<ProjectFacadeBillingDao>('ProjectFacadeBillingDao').to(ProjectFacadeBillingRepository)

container.bind<ProjectFacadeDocumentDao>('ProjectFacadeDocumentDao').to(ProjectFacadeDocumentRepository)

container.bind<ProjectGalleryDao>('ProjectGalleryDao').to(ProjectGalleryRepository)

container.bind<RoleDao>('RoleDao').to(RoleRepository)

container.bind<RoomDao>('RoomDao').to(RoomRepository)

container.bind<UserDao>('UserDao').to(UserRepository)

container.bind<UserProfilesDao>('UserProfilesDao').to(UserProfilesRepository)

container.bind<UserPreferencesDao>('UserPreferencesDao').to(UserPreferencesRepository)

container.bind<TenantDao>('TenantDao').to(TenantRepository)

container.bind<UserPreferredRoommatesDao>('UserPreferredRoommatesDao').to(UserPreferredRoommatesRepository)

container.bind<TransactionDao>('TransactionDao').to(TransactionRepository)

container.bind<UserScoreDao>('UserScoreDao').to(UserScoreRepository)

container.bind<PaymentDao>('PaymentDao').to(PaymentRepository)
