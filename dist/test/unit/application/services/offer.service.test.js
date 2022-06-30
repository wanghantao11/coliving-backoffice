"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const offer_service_1 = require("./../../../../src/application/services/offer.service");
const entity_1 = require("./../../../../src/domain/entity");
const repository_1 = require("./../../../../src/domain/repository");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("../../../");
const constants_1 = require("./../../../../src/infrastructure/constants");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing OfferService', () => {
    const offerDao = new repository_1.OfferRepository();
    const addressDao = new repository_1.AddressRepository();
    const adminDao = new repository_1.AdminRepository();
    const apartmentDao = new repository_1.ApartmentRepository();
    const projectDao = new repository_1.ProjectRepository();
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const clientDao = new repository_1.ClientRepository();
    const contractDao = new repository_1.ContractRepository();
    const roomDao = new repository_1.RoomRepository();
    const userDao = new repository_1.UserRepository();
    const userPreferencesDao = new repository_1.UserPreferencesRepository();
    const userProfileDao = new repository_1.UserProfilesRepository();
    const userPreferredRoommatesDao = new repository_1.UserPreferredRoommatesRepository();
    const userScoreDao = new repository_1.UserScoreRepository();
    const transactionDao = new repository_1.TransactionRepository();
    const offerService = new offer_service_1.OfferService(offerDao, adminDao, projectDao, roomDao, transactionDao, userPreferencesDao, userDao, userProfileDao, userScoreDao, userPreferredRoommatesDao, contractDao);
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
    };
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const offerDao = yield __1.db.getRepo(entity_1.Offer);
            yield offerDao.query('DELETE FROM offer;');
            const projectFacadeDao = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeDao.query('DELETE FROM project_facade;');
            const roomDao = yield __1.db.getRepo(entity_1.Room);
            yield roomDao.query('DELETE FROM room;');
            const userDao = yield __1.db.getRepo(entity_1.User);
            yield userDao.query('DELETE FROM "user";');
            const clientDao = yield __1.db.getRepo(entity_1.Client);
            yield clientDao.query('DELETE FROM client;');
            const addressRepo = yield __1.db.getRepo(entity_1.Address);
            yield addressRepo.query('DELETE FROM address;');
            const apartmentRepo = yield __1.db.getRepo(entity_1.Apartment);
            yield apartmentRepo.query('DELETE FROM apartment;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const offerDao = yield __1.db.getRepo(entity_1.Offer);
            yield offerDao.query('DELETE FROM offer;');
            const projectFacadeDao = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeDao.query('DELETE FROM project_facade;');
            const roomDao = yield __1.db.getRepo(entity_1.Room);
            yield roomDao.query('DELETE FROM room;');
            const userDao = yield __1.db.getRepo(entity_1.User);
            yield userDao.query('DELETE FROM "user";');
            const clientDao = yield __1.db.getRepo(entity_1.Client);
            yield clientDao.query('DELETE FROM client;');
            const addressRepo = yield __1.db.getRepo(entity_1.Address);
            yield addressRepo.query('DELETE FROM address;');
            const apartmentRepo = yield __1.db.getRepo(entity_1.Apartment);
            yield apartmentRepo.query('DELETE FROM apartment;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should get the created offer of the available room', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        const createdRoom = yield roomDao.createRoom(room);
        const offerData = {
            room_id: createdRoom.id,
            facade_id: savedAcc.id,
            iduser: savedUser.iduser,
            status: constants_1.OFFER_STATUS.PENDING,
            is_preferences_matched: true,
        };
        const offer = yield entity_1.Offer.generateOffer(offerData);
        yield offerService.createOffer(offer);
        const fetchedOffers = yield offerService.getOffersByExternalId(offerData.iduser);
        expect(fetchedOffers.length).toEqual(1);
        expect(fetchedOffers[0].iduser).toEqual(savedUser.iduser);
        expect(fetchedOffers[0].room_id).toEqual(createdRoom.id);
        expect(fetchedOffers[0].status).toEqual(constants_1.OFFER_STATUS.PENDING);
    }));
    it('should accept the offer and update offer status and room status', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        const createdRoom = yield roomDao.createRoom(room);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        yield transactionDao.createUserWithPreferencesAndProfiles(user);
        const offerData = {
            room_id: createdRoom.id,
            facade_id: savedAcc.id,
            iduser: user.iduser,
            status: constants_1.OFFER_STATUS.PENDING,
            is_preferences_matched: true,
        };
        const offer = yield entity_1.Offer.generateOffer(offerData);
        const createdOffer = yield offerService.createOffer(offer);
        yield offerService.acceptOffer(createdOffer.id);
        const fetchedOffer = yield offerDao.getOfferBy({ id: createdOffer.id });
        const fetchedRoom = yield roomDao.getRoomBy({ id: createdRoom.id });
        const fetchedUser = yield userDao.getUserBy({ iduser: userData.iduser });
        expect(fetchedOffer.status).toEqual(constants_1.OFFER_STATUS.ACCEPTED);
        expect(fetchedRoom.status).toEqual(constants_1.ROOM_STATUS.RESERVED);
        expect(fetchedUser.user_type).toEqual(constants_1.USER_TYPE.CANDIDATE);
    }));
    it('should not be able to accept an offer of which room is not available any more', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
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
            status: constants_1.ROOM_STATUS.RESERVED,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        const createdRoom = yield roomDao.createRoom(room);
        const offerData = {
            room_id: createdRoom.id,
            facade_id: savedAcc.id,
            iduser: savedUser.iduser,
            status: constants_1.OFFER_STATUS.PENDING,
            is_preferences_matched: true,
        };
        const offer = yield entity_1.Offer.generateOffer(offerData);
        const createdOffer = yield offerService.createOffer(offer);
        yield offerService.acceptOffer(createdOffer.id).catch(e => expect(e.message).toEqual('NOT_ALLOWED'));
    }));
    it('start the matching algorithm and find available offers', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        yield roomDao.createRoom(room);
        const fetchedOffers = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffers.length).toEqual(0);
        const searchOfferInput = {
            iduser: savedUser.iduser,
            facade_id: savedAcc.id,
            is_suitable_for_disability: false,
            has_room_type_preference: false,
            has_single_room: true,
            has_double_room: true,
            has_private_bathroom: false,
            has_private_toilet: false,
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffersAfterMatching.length).toEqual(1);
    }));
    it('start the matching algorithm and dont find available offers due to is_suitable_for_disability mismatch', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        yield roomDao.createRoom(room);
        const fetchedOffers = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffers.length).toEqual(0);
        const searchOfferInput = {
            iduser: savedUser.iduser,
            facade_id: savedAcc.id,
            is_suitable_for_disability: true,
            has_room_type_preference: false,
            has_single_room: true,
            has_double_room: true,
            has_private_bathroom: false,
            has_private_toilet: false,
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffersAfterMatching.length).toEqual(0);
    }));
    it('start the matching algorithm and find available offers due to double_room preference matches', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        yield roomDao.createRoom(room);
        const fetchedOffers = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffers.length).toEqual(0);
        const searchOfferInput = {
            iduser: savedUser.iduser,
            facade_id: savedAcc.id,
            is_suitable_for_disability: false,
            has_room_type_preference: false,
            has_single_room: true,
            has_double_room: true,
            has_private_bathroom: false,
            has_private_toilet: false,
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffersAfterMatching.length).toEqual(1);
    }));
    it('start the matching algorithm and find available offers due to double_room preference mismatches', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        yield roomDao.createRoom(room);
        const fetchedOffers = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffers.length).toEqual(0);
        const searchOfferInput = {
            iduser: savedUser.iduser,
            facade_id: savedAcc.id,
            is_suitable_for_disability: false,
            has_room_type_preference: true,
            has_single_room: true,
            has_double_room: false,
            has_private_bathroom: false,
            has_private_toilet: false,
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffersAfterMatching.length).toEqual(1);
    }));
    it('start the matching algorithm and find 1 available offer of 3 rooms in the same apartment', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        const createdRoom = yield roomDao.createRoom(room);
        roomData.number = '1302';
        roomData.size = 12;
        const room2 = yield entity_1.Room.generateRoom(roomData);
        const createdRoom2 = yield roomDao.createRoom(room2);
        roomData.number = '1303';
        const room3 = yield entity_1.Room.generateRoom(roomData);
        const createdRoom3 = yield roomDao.createRoom(room3);
        const fetchedOffers = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffers.length).toEqual(0);
        const searchOfferInput = {
            iduser: savedUser.iduser,
            facade_id: savedAcc.id,
            is_suitable_for_disability: false,
            has_room_type_preference: false,
            has_single_room: true,
            has_double_room: true,
            has_private_bathroom: false,
            has_private_toilet: false,
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: savedUser.iduser });
        expect(fetchedOffersAfterMatching.length).toEqual(1);
    }));
    it('start the matching algorithm and find 1 available offer for preferred roommate users in the double room', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const accomodationData = {
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        };
        const acc = yield entity_1.ProjectFacade.generateProjectFacade(accomodationData);
        const savedAcc = yield projectFacadeDao.createProjectFacade(acc);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const apartment = entity_1.Apartment.generateApartment({
            facade_id: savedAcc.id,
            name: 'Red building',
        });
        const savedApartment = yield apartmentDao.createApartment(apartment);
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
            status: constants_1.ROOM_STATUS.AVAILABLE,
        };
        const room = yield entity_1.Room.generateRoom(roomData);
        const createdRoom = yield roomDao.createRoom(room);
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
        };
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
        };
        const inviter = yield entity_1.User.generateUser(Object.assign(Object.assign({}, inviterData), { client_id: savedClient.id }));
        yield transactionDao.createUserWithPreferencesAndProfiles(inviter);
        const invitee = yield entity_1.User.generateUser(Object.assign(Object.assign({}, inviteeData), { client_id: savedClient.id }));
        yield transactionDao.createUserWithPreferencesAndProfiles(invitee);
        const preferredRoommateData = {
            inviter_id: inviterData.iduser,
            invitee_id: inviteeData.iduser,
            status: 'Accepted',
        };
        const preferredRoommate = yield entity_1.UserPreferredRoommates.generateUserPreferredRoomate(preferredRoommateData);
        const savedPreferredRoomate = yield userPreferredRoommatesDao.createUserPreferredRoommate(preferredRoommate);
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
        };
        yield offerService.searchMatchedOffer(searchOfferInput);
        const fetchedOffersAfterMatching = yield offerDao.getOffersBy({ iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90' });
        const fetchedOffersAfterMatching2 = yield offerDao.getOffersBy({ iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg91' });
        expect(fetchedOffersAfterMatching.length).toEqual(1);
        expect(fetchedOffersAfterMatching[0].room_id).toEqual(createdRoom.id);
        expect(fetchedOffersAfterMatching2.length).toEqual(1);
        expect(fetchedOffersAfterMatching2[0].room_id).toEqual(createdRoom.id);
    }));
});
//# sourceMappingURL=offer.service.test.js.map