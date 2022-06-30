import { isNumber, orderBy, sumBy, minBy } from 'lodash'

import { UserPreferences, Room, Offer, UserScore, ProjectFacade } from '../../domain/entity'
import {
  OFFER_STATUS, ROOM_STATUS,
  MAX_OFFER_NUMBER, MINUEND_OF_INVERTED_SCORE, PERSONALITY_CATEGORY_MAPPING
} from '../../infrastructure/constants'
import {
  IApartmentScoreWithRooms,
  IRoomWithScore,
  ITenantWithScore,
  ITypeformResponse
} from '../../interfaces'
import { OfferDao, UserDao, UserPreferencesDao } from '../../domain/dao'

export const checkIsRoomListEmpty = (rooms: Room[]): boolean =>
  rooms.length === 0

export const filterByAccessability = (preferences: Partial<UserPreferences>) => (rooms: Room[]) =>
  preferences.is_suitable_for_disability
    ? rooms.filter(room => room.is_suitable_for_disability)
    : rooms

export const filterByRoomType = (preferences: Partial<UserPreferences>) => (rooms: Room[]): Room[] => {
  if (preferences.has_room_type_preference) {
    if (preferences.has_double_room === true && preferences.has_single_room === true) {
      return rooms
    } else {
      return rooms.filter(room => {
        if (preferences.has_single_room) {
          return room.people_per_room === 1
        } else if (preferences.has_double_room) {
          return room.people_per_room === 2
        } else {
          return []
        }
      })
    }
  } else {
    return rooms
  }
}

export const filterByFacility = (preferences: Partial<UserPreferences>) => (rooms: Room[]) =>
  preferences.has_private_toilet || preferences.has_private_bathroom ?
    rooms.filter(room => {
      if (preferences.has_private_bathroom && !preferences.has_private_toilet) {
        return room.has_private_bathroom
      } else if (preferences.has_private_toilet && !preferences.has_private_bathroom) {
        return room.has_private_toilet
      } else if (preferences.has_private_toilet && preferences.has_private_bathroom) {
        return room.has_private_toilet && room.has_private_bathroom
      }
    }) : rooms

export const filterByPrice = (preferences: Partial<UserPreferences>) => (rooms: Room[]) =>
  isNumber(preferences.rent_to) ? rooms.filter(room => (room.rent + room.service_fee) <= preferences.rent_to) : rooms

export const filterRoomsByPreferences = (rooms: Room[]) => (preferences: Partial<UserPreferences>): Promise<any> => {
  const {
    is_suitable_for_disability,
    has_room_type_preference,
    has_single_room,
    has_double_room,
    has_private_bathroom,
    has_private_toilet,
    rent_to } = preferences

  const filterMap = {
    f1: { filter: filterByAccessability, condition: { is_suitable_for_disability }, name: 'accessability_filter' },
    f2: { filter: filterByRoomType, condition: { has_room_type_preference, has_single_room, has_double_room }, name: 'room_type_filter' },
    f3: { filter: filterByFacility, condition: { has_private_bathroom, has_private_toilet }, name: 'facility_filter' },
    f4: { filter: filterByPrice, condition: { rent_to }, name: 'price_filter' },
  }

  const log = { fail: { [filterMap.f1.name]: false, [filterMap.f2.name]: false, [filterMap.f3.name]: false, [filterMap.f4.name]: false } }
  let roomsPrev: Room[] = rooms
  let roomsCurr: Room[] = []
  let isPreferencesMatched = true
  const filterLog: any = {}

  for (const filterItem of Object.values(filterMap)) {
    const { filter, condition, name } = filterItem
    roomsCurr = filter(condition)(roomsPrev)
    filterLog[`after_${name}`] = roomsCurr.length
    if (roomsCurr.length === 0) {
      log.fail[name] = true
      isPreferencesMatched = false
      // TODO: Track offer event in the future
      if (name === filterMap.f1.name) {
        return Promise.resolve({ rooms: [], filterLog })
      }
      if (name === filterMap.f4.name) {
        const cheapestRoom: Room = minBy(roomsPrev, room => room.rent + room.service_fee)
        return Promise.resolve({ rooms: [cheapestRoom], isPreferencesMatched, filterLog })
      }
      break
    } else {
      roomsPrev = roomsCurr
    }
  }
  return Promise.resolve({ rooms: roomsPrev, isPreferencesMatched, filterLog })
}

export const scoreInPercentageGenerator = (
  userScore: UserScore, tenantsWithScore: ITenantWithScore[]): number => {
  const score = scoreGenerator(userScore, tenantsWithScore)
  return 100 * (10 - score) / 10
}

export const scoreGenerator = (userScore: UserScore, tenantsWithScore: ITenantWithScore[]): number =>
  Object.keys(PERSONALITY_CATEGORY_MAPPING).reduce((sum, category) => {
    // |userAverageScorePerCategory - groupAverageScorePerCategory| * weight
    const userAverageScorePerCategory = Number((userScore)[category])
    const groupAverageScorePerCategory: number =
      sumBy(tenantsWithScore, item => Number(item[category])) / tenantsWithScore.length
    const deltaScore: number = Math.abs(userAverageScorePerCategory - groupAverageScorePerCategory)
    const weight: number = PERSONALITY_CATEGORY_MAPPING[category].weight
    const deltaScoreWeighted: number = deltaScore * weight
    return sum + deltaScoreWeighted
  }, 0)

export const pickRoomsByScore = (rooms: Room[]) => (
  userScore: UserScore, tenantsWithScore: ITenantWithScore[]): IRoomWithScore[] => {
  const apartmentScoreWithRooms = rooms.reduce<IApartmentScoreWithRooms>((result, room) => {
    if (!result.apartments[room.apartment_id]) {
      const tenantsWithScoreInCurrentApartment =
        tenantsWithScore.filter(tenant => tenant.apartment_id === room.apartment_id)
      if (tenantsWithScoreInCurrentApartment.length === 0) {
        return result
      }
      result.apartments[room.apartment_id] = scoreGenerator(userScore, tenantsWithScoreInCurrentApartment)
      result.rooms.push({ ...room, score: result.apartments[room.apartment_id] })
    } else {
      result.rooms.push({ ...room, score: result.apartments[room.apartment_id] })
    }
    return result
  }, { apartments: {}, rooms: [] })
  return orderBy(apartmentScoreWithRooms.rooms, ['score'], ['asc'])
}

export const pickNonIdenticalRooms = (rooms: Room[]): Room[] =>
  rooms.reduce((roomList, room) => {
    if (
      !roomList.some(
        _room =>
          _room.rent === room.rent &&
          _room.size === room.size &&
          _room.people_per_room === room.people_per_room &&
          _room.apartment_id === room.apartment_id &&
          _room.rent === room.rent &&
          _room.has_private_bathroom === room.has_private_bathroom &&
          _room.has_private_toilet === room.has_private_toilet &&
          _room.service_fee === room.service_fee &&
          _room.is_suitable_for_disability ===
          room.is_suitable_for_disability &&
          _room.status === room.status
      )
    ) {
      roomList.push(room)
    }
    return roomList
  }, [])

export const excludeRejectedOffersFromRooms = (rooms: Room[]) => (offers: Offer[]) =>
  rooms.filter(room => !offers.map(offer => offer.room_id).includes(room.id))

export const checkIfUserHasNonRejectedOffers = (offers: Offer[]): boolean =>
  offers.filter(offer => offer.status !== OFFER_STATUS.REJECTED).length !== 0

export const checkIfUserHasAcceptedOffer = (offers: Offer[]): boolean =>
  offers.filter(offer => offer.status === OFFER_STATUS.ACCEPTED).length !== 0

export const getJointPreferences = (preferences: Partial<UserPreferences>) => (
  roommate_preferences: UserPreferences) => {
  const { is_suitable_for_disability, ...rest } = preferences
  return {
    ...rest,
    is_suitable_for_disability: is_suitable_for_disability ||
      roommate_preferences.is_suitable_for_disability,
  }
}

export const pickRoomsByPriority = (rooms: Room[]) => (preferences: Partial<UserPreferences>): Room[] => {
  const { has_private_toilet, has_private_bathroom, has_room_type_preference } = preferences
  if (!has_room_type_preference) {
    return orderBy(rooms, ['number', 'people_per_room'], 'asc')
  } else if (!has_private_bathroom && !has_private_toilet) {
    return orderBy(rooms, ['number', 'has_private_bathroom', 'has_private_toilet'], 'asc')
  }
  return orderBy(rooms, ['number'], 'asc')
}

export const checkIfAllApartmentsEmpty = (rooms: Room[]): boolean =>
  rooms.filter(room => [ROOM_STATUS.RESERVED, ROOM_STATUS.OCCUPIED].includes(room.status)).length === 0

export const pickTopRankedRooms = (rooms: Room[]): Room[] =>
  rooms.slice(0, MAX_OFFER_NUMBER)

export const excludeOrphanRooms = (rooms: Room[]): Room[] =>
  rooms.filter(room => room.apartment_id)

const getPersonalityCategory = (row: ITypeformResponse): string => {
  let category
  for (const cate of Object.keys(PERSONALITY_CATEGORY_MAPPING)) {
    if (row.field.ref.includes(cate)) {
      category = cate
      break
    }
  }
  return category
}

const isInvertedQuestion = (row: ITypeformResponse): boolean =>
  row.field.ref.includes('inverted')

const invertScore = (score: number): number => MINUEND_OF_INVERTED_SCORE - score

const calculateAverageScore = (totalScore: UserScore): UserScore => {
  Object.keys(totalScore).forEach(category =>
    totalScore[category] = totalScore[category] / PERSONALITY_CATEGORY_MAPPING[category].count_of_questions)
  return totalScore
}

const calculateSumScore = (rows: any[]): UserScore =>
  rows.reduce((result, row) => {
    const category: string = getPersonalityCategory(row)
    if (!category) {
      return result
    } else {
      const score: number = isInvertedQuestion(row) ? invertScore(row.number) : row.number
      result[category] = result[category] ? result[category] + score : score
    }
    return result
  }, {})

export const aggregateRawUserScore = (rows: any[]): UserScore => {
  const totalScore: UserScore = calculateSumScore(rows)
  const averageScore: UserScore = calculateAverageScore(totalScore)
  return averageScore
}

export const processOfferRejection = (
  { rejection_reason, offer, iduser },
  offerService: OfferDao,
  userService: UserDao,
  userPreferencesService: UserPreferencesDao) =>
  // if not interested, clear all history, otherwise reject the current offer
  rejection_reason.exit_search ? offerService.deleteOffersBy({ iduser })
    .then(() => userService.getUserBy({ iduser })
      .then(({ user_key }) => userPreferencesService.updateUserPreferences(user_key, { needs_manual_offer: false })))
    : offerService.updateOfferBy({ id: offer.id }, { status: OFFER_STATUS.REJECTED })

export const processOfferFlowSwitch = (
  { id: facade_id, is_auto_offer_flow }: Partial<ProjectFacade>,
  offerService: OfferDao
): Promise<void> => new Promise<void>(resolve => {
  if (!is_auto_offer_flow) {
    offerService.deleteOffersBy({ facade_id, is_sent_by_admin: false, status: OFFER_STATUS.PENDING })
  }
  resolve()
})
