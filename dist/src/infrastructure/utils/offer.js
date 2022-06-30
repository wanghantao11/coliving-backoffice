"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOfferFlowSwitch = exports.processOfferRejection = exports.aggregateRawUserScore = exports.excludeOrphanRooms = exports.pickTopRankedRooms = exports.checkIfAllApartmentsEmpty = exports.pickRoomsByPriority = exports.getJointPreferences = exports.checkIfUserHasAcceptedOffer = exports.checkIfUserHasNonRejectedOffers = exports.excludeRejectedOffersFromRooms = exports.pickNonIdenticalRooms = exports.pickRoomsByScore = exports.scoreGenerator = exports.scoreInPercentageGenerator = exports.filterRoomsByPreferences = exports.filterByPrice = exports.filterByFacility = exports.filterByRoomType = exports.filterByAccessability = exports.checkIsRoomListEmpty = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("../../infrastructure/constants");
exports.checkIsRoomListEmpty = (rooms) => rooms.length === 0;
exports.filterByAccessability = (preferences) => (rooms) => preferences.is_suitable_for_disability
    ? rooms.filter(room => room.is_suitable_for_disability)
    : rooms;
exports.filterByRoomType = (preferences) => (rooms) => {
    if (preferences.has_room_type_preference) {
        if (preferences.has_double_room === true && preferences.has_single_room === true) {
            return rooms;
        }
        else {
            return rooms.filter(room => {
                if (preferences.has_single_room) {
                    return room.people_per_room === 1;
                }
                else if (preferences.has_double_room) {
                    return room.people_per_room === 2;
                }
                else {
                    return [];
                }
            });
        }
    }
    else {
        return rooms;
    }
};
exports.filterByFacility = (preferences) => (rooms) => preferences.has_private_toilet || preferences.has_private_bathroom ?
    rooms.filter(room => {
        if (preferences.has_private_bathroom && !preferences.has_private_toilet) {
            return room.has_private_bathroom;
        }
        else if (preferences.has_private_toilet && !preferences.has_private_bathroom) {
            return room.has_private_toilet;
        }
        else if (preferences.has_private_toilet && preferences.has_private_bathroom) {
            return room.has_private_toilet && room.has_private_bathroom;
        }
    }) : rooms;
exports.filterByPrice = (preferences) => (rooms) => lodash_1.isNumber(preferences.rent_to) ? rooms.filter(room => (room.rent + room.service_fee) <= preferences.rent_to) : rooms;
exports.filterRoomsByPreferences = (rooms) => (preferences) => {
    const { is_suitable_for_disability, has_room_type_preference, has_single_room, has_double_room, has_private_bathroom, has_private_toilet, rent_to } = preferences;
    const filterMap = {
        f1: { filter: exports.filterByAccessability, condition: { is_suitable_for_disability }, name: 'accessability_filter' },
        f2: { filter: exports.filterByRoomType, condition: { has_room_type_preference, has_single_room, has_double_room }, name: 'room_type_filter' },
        f3: { filter: exports.filterByFacility, condition: { has_private_bathroom, has_private_toilet }, name: 'facility_filter' },
        f4: { filter: exports.filterByPrice, condition: { rent_to }, name: 'price_filter' },
    };
    const log = { fail: { [filterMap.f1.name]: false, [filterMap.f2.name]: false, [filterMap.f3.name]: false, [filterMap.f4.name]: false } };
    let roomsPrev = rooms;
    let roomsCurr = [];
    let isPreferencesMatched = true;
    const filterLog = {};
    for (const filterItem of Object.values(filterMap)) {
        const { filter, condition, name } = filterItem;
        roomsCurr = filter(condition)(roomsPrev);
        filterLog[`after_${name}`] = roomsCurr.length;
        if (roomsCurr.length === 0) {
            log.fail[name] = true;
            isPreferencesMatched = false;
            // TODO: Track offer event in the future
            if (name === filterMap.f1.name) {
                return Promise.resolve({ rooms: [], filterLog });
            }
            if (name === filterMap.f4.name) {
                const cheapestRoom = lodash_1.minBy(roomsPrev, room => room.rent + room.service_fee);
                return Promise.resolve({ rooms: [cheapestRoom], isPreferencesMatched, filterLog });
            }
            break;
        }
        else {
            roomsPrev = roomsCurr;
        }
    }
    return Promise.resolve({ rooms: roomsPrev, isPreferencesMatched, filterLog });
};
exports.scoreInPercentageGenerator = (userScore, tenantsWithScore) => {
    const score = exports.scoreGenerator(userScore, tenantsWithScore);
    return 100 * (10 - score) / 10;
};
exports.scoreGenerator = (userScore, tenantsWithScore) => Object.keys(constants_1.PERSONALITY_CATEGORY_MAPPING).reduce((sum, category) => {
    // |userAverageScorePerCategory - groupAverageScorePerCategory| * weight
    const userAverageScorePerCategory = Number((userScore)[category]);
    const groupAverageScorePerCategory = lodash_1.sumBy(tenantsWithScore, item => Number(item[category])) / tenantsWithScore.length;
    const deltaScore = Math.abs(userAverageScorePerCategory - groupAverageScorePerCategory);
    const weight = constants_1.PERSONALITY_CATEGORY_MAPPING[category].weight;
    const deltaScoreWeighted = deltaScore * weight;
    return sum + deltaScoreWeighted;
}, 0);
exports.pickRoomsByScore = (rooms) => (userScore, tenantsWithScore) => {
    const apartmentScoreWithRooms = rooms.reduce((result, room) => {
        if (!result.apartments[room.apartment_id]) {
            const tenantsWithScoreInCurrentApartment = tenantsWithScore.filter(tenant => tenant.apartment_id === room.apartment_id);
            if (tenantsWithScoreInCurrentApartment.length === 0) {
                return result;
            }
            result.apartments[room.apartment_id] = exports.scoreGenerator(userScore, tenantsWithScoreInCurrentApartment);
            result.rooms.push(Object.assign(Object.assign({}, room), { score: result.apartments[room.apartment_id] }));
        }
        else {
            result.rooms.push(Object.assign(Object.assign({}, room), { score: result.apartments[room.apartment_id] }));
        }
        return result;
    }, { apartments: {}, rooms: [] });
    return lodash_1.orderBy(apartmentScoreWithRooms.rooms, ['score'], ['asc']);
};
exports.pickNonIdenticalRooms = (rooms) => rooms.reduce((roomList, room) => {
    if (!roomList.some(_room => _room.rent === room.rent &&
        _room.size === room.size &&
        _room.people_per_room === room.people_per_room &&
        _room.apartment_id === room.apartment_id &&
        _room.rent === room.rent &&
        _room.has_private_bathroom === room.has_private_bathroom &&
        _room.has_private_toilet === room.has_private_toilet &&
        _room.service_fee === room.service_fee &&
        _room.is_suitable_for_disability ===
            room.is_suitable_for_disability &&
        _room.status === room.status)) {
        roomList.push(room);
    }
    return roomList;
}, []);
exports.excludeRejectedOffersFromRooms = (rooms) => (offers) => rooms.filter(room => !offers.map(offer => offer.room_id).includes(room.id));
exports.checkIfUserHasNonRejectedOffers = (offers) => offers.filter(offer => offer.status !== constants_1.OFFER_STATUS.REJECTED).length !== 0;
exports.checkIfUserHasAcceptedOffer = (offers) => offers.filter(offer => offer.status === constants_1.OFFER_STATUS.ACCEPTED).length !== 0;
exports.getJointPreferences = (preferences) => (roommate_preferences) => {
    const { is_suitable_for_disability } = preferences, rest = __rest(preferences, ["is_suitable_for_disability"]);
    return Object.assign(Object.assign({}, rest), { is_suitable_for_disability: is_suitable_for_disability ||
            roommate_preferences.is_suitable_for_disability });
};
exports.pickRoomsByPriority = (rooms) => (preferences) => {
    const { has_private_toilet, has_private_bathroom, has_room_type_preference } = preferences;
    if (!has_room_type_preference) {
        return lodash_1.orderBy(rooms, ['number', 'people_per_room'], 'asc');
    }
    else if (!has_private_bathroom && !has_private_toilet) {
        return lodash_1.orderBy(rooms, ['number', 'has_private_bathroom', 'has_private_toilet'], 'asc');
    }
    return lodash_1.orderBy(rooms, ['number'], 'asc');
};
exports.checkIfAllApartmentsEmpty = (rooms) => rooms.filter(room => [constants_1.ROOM_STATUS.RESERVED, constants_1.ROOM_STATUS.OCCUPIED].includes(room.status)).length === 0;
exports.pickTopRankedRooms = (rooms) => rooms.slice(0, constants_1.MAX_OFFER_NUMBER);
exports.excludeOrphanRooms = (rooms) => rooms.filter(room => room.apartment_id);
const getPersonalityCategory = (row) => {
    let category;
    for (const cate of Object.keys(constants_1.PERSONALITY_CATEGORY_MAPPING)) {
        if (row.field.ref.includes(cate)) {
            category = cate;
            break;
        }
    }
    return category;
};
const isInvertedQuestion = (row) => row.field.ref.includes('inverted');
const invertScore = (score) => constants_1.MINUEND_OF_INVERTED_SCORE - score;
const calculateAverageScore = (totalScore) => {
    Object.keys(totalScore).forEach(category => totalScore[category] = totalScore[category] / constants_1.PERSONALITY_CATEGORY_MAPPING[category].count_of_questions);
    return totalScore;
};
const calculateSumScore = (rows) => rows.reduce((result, row) => {
    const category = getPersonalityCategory(row);
    if (!category) {
        return result;
    }
    else {
        const score = isInvertedQuestion(row) ? invertScore(row.number) : row.number;
        result[category] = result[category] ? result[category] + score : score;
    }
    return result;
}, {});
exports.aggregateRawUserScore = (rows) => {
    const totalScore = calculateSumScore(rows);
    const averageScore = calculateAverageScore(totalScore);
    return averageScore;
};
exports.processOfferRejection = ({ rejection_reason, offer, iduser }, offerService, userService, userPreferencesService) => 
// if not interested, clear all history, otherwise reject the current offer
rejection_reason.exit_search ? offerService.deleteOffersBy({ iduser })
    .then(() => userService.getUserBy({ iduser })
    .then(({ user_key }) => userPreferencesService.updateUserPreferences(user_key, { needs_manual_offer: false })))
    : offerService.updateOfferBy({ id: offer.id }, { status: constants_1.OFFER_STATUS.REJECTED });
exports.processOfferFlowSwitch = ({ id: facade_id, is_auto_offer_flow }, offerService) => new Promise(resolve => {
    if (!is_auto_offer_flow) {
        offerService.deleteOffersBy({ facade_id, is_sent_by_admin: false, status: constants_1.OFFER_STATUS.PENDING });
    }
    resolve();
});
//# sourceMappingURL=offer.js.map