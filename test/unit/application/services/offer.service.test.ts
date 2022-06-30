import * as dotenv from 'dotenv'
dotenv.config()

import { OfferService } from './../../../../src/application/services/offer.service'
import {
  ApartmentDao,
  AddressDao,
  AdminDao,
  ClientDao,
  ContractDao,
  OfferDao,
  ProjectDao,
  ProjectFacadeDao,
  RoomDao,
  UserDao,
  UserPreferencesDao,
  UserProfilesDao,
  UserPreferredRoommatesDao,
  UserScoreDao,
  TransactionDao
} from './../../../../src/domain/dao'
import { Address, Apartment, ProjectFacade, Client, Room, Offer, User, UserPreferredRoommates } from './../../../../src/domain/entity'
import {
  AddressRepository,
  ApartmentRepository,
  AdminRepository,
  ClientRepository,
  ContractRepository,
  OfferRepository,
  ProjectRepository,
  ProjectFacadeRepository,
  RoomRepository,
  UserRepository,
  UserPreferencesRepository,
  UserPreferredRoommatesRepository,
  UserProfilesRepository,
  UserScoreRepository,
  TransactionRepository
} from './../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from '../../../'
import { OFFER_STATUS, ROOM_STATUS, USER_TYPE } from './../../../../src/infrastructure/constants'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing OfferService', () => {
  const offerDao: OfferDao = new OfferRepository()
  const addressDao: AddressDao = new AddressRepository()
  const adminDao: AdminDao = new AdminRepository()
  const apartmentDao: ApartmentDao = new ApartmentRepository()
  const projectDao: ProjectDao = new ProjectRepository()
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const clientDao: ClientDao = new ClientRepository()
  const contractDao: ContractDao = new ContractRepository()
  const roomDao: RoomDao = new RoomRepository()
  const userDao: UserDao = new UserRepository()
  const userPreferencesDao: UserPreferencesDao = new UserPreferencesRepository()
  const userProfileDao: UserProfilesDao = new UserProfilesRepository()
  const userPreferredRoommatesDao: UserPreferredRoommatesDao = new UserPreferredRoommatesRepository()
  const userScoreDao: UserScoreDao = new UserScoreRepository()
  const transactionDao: TransactionDao = new TransactionRepository()

  const offerService = new OfferService(
    offerDao,
    adminDao,
    projectDao,
    roomDao,
    transactionDao,
    userPreferencesDao,
    userDao,
    userProfileDao,
    userScoreDao,
    userPreferredRoommatesDao,
    contractDao)

  const userData = {
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
    email: 'test@thisisfake.colive.se',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    registration_time: new Date('2018-08-08'),
  }

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  beforeEach(async done => {
    try {
      const offerDao = await db.getRepo<Offer>(Offer)
      await offerDao.query('DELETE FROM offer;')
      const projectFacadeDao = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeDao.query('DELETE FROM project_facade;')
      const roomDao = await db.getRepo<Room>(Room)
      await roomDao.query('DELETE FROM room;')
      const userDao = await db.getRepo<User>(User)
      await userDao.query('DELETE FROM "user";')
      const clientDao = await db.getRepo<Client>(Client)
      await clientDao.query('DELETE FROM client;')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
      const apartmentRepo = await db.getRepo<Apartment>(Apartment)
      await apartmentRepo.query('DELETE FROM apartment;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const offerDao = await db.getRepo<Offer>(Offer)
      await offerDao.query('DELETE FROM offer;')
      const projectFacadeDao = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeDao.query('DELETE FROM project_facade;')
      const roomDao = await db.getRepo<Room>(Room)
      await roomDao.query('DELETE FROM room;')
      const userDao = await db.getRepo<User>(User)
      await userDao.query('DELETE FROM "user";')
      const clientDao = await db.getRepo<Client>(Client)
      await clientDao.query('DELETE FROM client;')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
      const apartmentRepo = await db.getRepo<Apartment>(Apartment)
      await apartmentRepo.query('DELETE FROM apartment;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should get the created offer of the available room', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const roomData = {
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    const createdRoom = await roomDao.createRoom(room)

    const offerData = {
      room_id: createdRoom.id,
      facade_id: savedAcc.id,
      iduser: savedUser.iduser,
      status: OFFER_STATUS.PENDING,
      is_preferences_matched: true,
    }
    const offer = await Offer.generateOffer(offerData)
    await offerService.createOffer(offer)

    const fetchedOffers = await offerService.getOffersByExternalId(offerData.iduser)

    expect(fetchedOffers.length).toEqual(1)
    expect(fetchedOffers[0].iduser).toEqual(savedUser.iduser)
    expect(fetchedOffers[0].room_id).toEqual(createdRoom.id)
    expect(fetchedOffers[0].status).toEqual(OFFER_STATUS.PENDING)
  })

  it('should accept the offer and update offer status and room status', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const roomData = {
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    const createdRoom = await roomDao.createRoom(room)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    await transactionDao.createUserWithPreferencesAndProfiles(user)

    const offerData = {
      room_id: createdRoom.id,
      facade_id: savedAcc.id,
      iduser: user.iduser,
      status: OFFER_STATUS.PENDING,
      is_preferences_matched: true,
    }
    const offer = await Offer.generateOffer(offerData)
    const createdOffer = await offerService.createOffer(offer)

    await offerService.acceptOffer(createdOffer.id)

    const fetchedOffer = await offerDao.getOfferBy({ id: createdOffer.id })
    const fetchedRoom = await roomDao.getRoomBy({ id: createdRoom.id })
    const fetchedUser = await userDao.getUserBy({ iduser: userData.iduser })
    expect(fetchedOffer.status).toEqual(OFFER_STATUS.ACCEPTED)
    expect(fetchedRoom.status).toEqual(ROOM_STATUS.RESERVED)
    expect(fetchedUser.user_type).toEqual(USER_TYPE.CANDIDATE)
  })

  it('should not be able to accept an offer of which room is not available any more', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const roomData = {
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
      status: ROOM_STATUS.RESERVED,
    }
    const room = await Room.generateRoom(roomData)
    const createdRoom = await roomDao.createRoom(room)

    const offerData = {
      room_id: createdRoom.id,
      facade_id: savedAcc.id,
      iduser: savedUser.iduser,
      status: OFFER_STATUS.PENDING,
      is_preferences_matched: true,
    }
    const offer = await Offer.generateOffer(offerData)
    const createdOffer = await offerService.createOffer(offer)

    await offerService.acceptOffer(createdOffer.id).catch(e => expect(e.message).toEqual('NOT_ALLOWED'))
  })

  it('start the matching algorithm and find available offers', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      apartment_id: savedApartment.id,
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 1,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    await roomDao.createRoom(room)

    const fetchedOffers = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffers.length).toEqual(0)

    const searchOfferInput = {
      iduser: savedUser.iduser,
      facade_id: savedAcc.id,
      is_suitable_for_disability: false,
      has_room_type_preference: false,
      has_single_room: true,
      has_double_room: true,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffersAfterMatching.length).toEqual(1)
  })

  it('start the matching algorithm and dont find available offers due to is_suitable_for_disability mismatch', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      address_id: savedAddress.id,
      apartment_id: savedApartment.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 1,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    await roomDao.createRoom(room)

    const fetchedOffers = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffers.length).toEqual(0)

    const searchOfferInput = {
      iduser: savedUser.iduser,
      facade_id: savedAcc.id,
      is_suitable_for_disability: true,
      has_room_type_preference: false,
      has_single_room: true,
      has_double_room: true,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffersAfterMatching.length).toEqual(0)
  })

  it('start the matching algorithm and find available offers due to double_room preference matches', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      address_id: savedAddress.id,
      apartment_id: savedApartment.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 2,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    await roomDao.createRoom(room)

    const fetchedOffers = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffers.length).toEqual(0)

    const searchOfferInput = {
      iduser: savedUser.iduser,
      facade_id: savedAcc.id,
      is_suitable_for_disability: false,
      has_room_type_preference: false,
      has_single_room: true,
      has_double_room: true,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffersAfterMatching.length).toEqual(1)
  })

  it('start the matching algorithm and find available offers due to double_room preference mismatches', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      address_id: savedAddress.id,
      apartment_id: savedApartment.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 2,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    await roomDao.createRoom(room)

    const fetchedOffers = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffers.length).toEqual(0)

    const searchOfferInput = {
      iduser: savedUser.iduser,
      facade_id: savedAcc.id,
      is_suitable_for_disability: false,
      has_room_type_preference: true,
      has_single_room: true,
      has_double_room: false,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffersAfterMatching.length).toEqual(1)
  })

  it('start the matching algorithm and find 1 available offer of 3 rooms in the same apartment', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      address_id: savedAddress.id,
      apartment_id: savedApartment.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 1,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    const createdRoom = await roomDao.createRoom(room)
    roomData.number = '1302'
    roomData.size = 12
    const room2 = await Room.generateRoom(roomData)
    const createdRoom2 = await roomDao.createRoom(room2)
    roomData.number = '1303'
    const room3 = await Room.generateRoom(roomData)
    const createdRoom3 = await roomDao.createRoom(room3)

    const fetchedOffers = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffers.length).toEqual(0)

    const searchOfferInput = {
      iduser: savedUser.iduser,
      facade_id: savedAcc.id,
      is_suitable_for_disability: false,
      has_room_type_preference: false,
      has_single_room: true,
      has_double_room: true,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: savedUser.iduser })
    expect(fetchedOffersAfterMatching.length).toEqual(1)
  })

  it('start the matching algorithm and find 1 available offer for preferred roommate users in the double room', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const accomodationData = {
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    }
    const acc = await ProjectFacade.generateProjectFacade(accomodationData)
    const savedAcc = await projectFacadeDao.createProjectFacade(acc)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const apartment = Apartment.generateApartment({
      facade_id: savedAcc.id,
      name: 'Red building',
    })
    const savedApartment = await apartmentDao.createApartment(apartment)

    const roomData = {
      address_id: savedAddress.id,
      apartment_id: savedApartment.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: false,
      people_per_room: 2,
      status: ROOM_STATUS.AVAILABLE,
    }
    const room = await Room.generateRoom(roomData)
    const createdRoom = await roomDao.createRoom(room)

    const inviterData = {
      iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
      first_name: 'Inviter First',
      last_name: 'Inviter Last',
      description: 'I am just a test user',
      tos_version_accepted: 1,
      user_type: 'Light',
      birthday: new Date('1991-01-01'),
      registration_time: new Date('2018-08-08'),
      email: 'fake@fafake.fake',
    }
    const inviteeData = {
      iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg91',
      first_name: 'Invitee First',
      last_name: 'Invitee Last',
      description: 'I am just a test user',
      tos_version_accepted: 1,
      user_type: 'Light',
      birthday: new Date('1991-01-01'),
      registration_time: new Date('2018-08-08'),
      email: 'fake1@fafake1.fake',
    }
    const inviter: User = await User.generateUser({ ...inviterData, client_id: savedClient.id })
    await transactionDao.createUserWithPreferencesAndProfiles(inviter)

    const invitee: User = await User.generateUser({ ...inviteeData, client_id: savedClient.id })
    await transactionDao.createUserWithPreferencesAndProfiles(invitee)

    const preferredRoommateData = {
      inviter_id: inviterData.iduser,
      invitee_id: inviteeData.iduser,
      status: 'Accepted',
    }

    const preferredRoommate = await UserPreferredRoommates.generateUserPreferredRoomate(preferredRoommateData)
    const savedPreferredRoomate = await userPreferredRoommatesDao.createUserPreferredRoommate(preferredRoommate)

    const searchOfferInput = {
      iduser: inviterData.iduser,
      facade_id: savedAcc.id,
      preferred_roommate_iduser: inviteeData.iduser,
      is_suitable_for_disability: false,
      has_room_type_preference: false,
      has_single_room: true,
      has_double_room: true,
      has_private_bathroom: false,
      has_private_toilet: false,
    }
    await offerService.searchMatchedOffer(searchOfferInput)

    const fetchedOffersAfterMatching = await offerDao.getOffersBy({ iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90' })
    const fetchedOffersAfterMatching2 = await offerDao.getOffersBy({ iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg91' })
    expect(fetchedOffersAfterMatching.length).toEqual(1)
    expect(fetchedOffersAfterMatching[0].room_id).toEqual(createdRoom.id)
    expect(fetchedOffersAfterMatching2.length).toEqual(1)
    expect(fetchedOffersAfterMatching2[0].room_id).toEqual(createdRoom.id)
  })
})
