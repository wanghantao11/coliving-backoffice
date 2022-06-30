import 'reflect-metadata'

import {
  filterByAccessability,
  filterByRoomType,
  filterByFacility,
  filterByPrice,
  pickNonIdenticalRooms,
  pickRoomsByScore,
  aggregateRawUserScore
} from '../../../../src/infrastructure/utils/offer'
import { Room, UserScore } from '../../../../src/domain/entity'
import { ITenantWithScore } from '../../../../src/interfaces'

describe('testing the offer function filterByAccessability()', () => {
  it('should filter out rooms unqualified', async () => {
    const is_suitable_for_disability = true
    const room: Room = await Room.generateRoom({
      facade_id: 1,
      address_id: 1,
      apartment_id: 1,
      name: 'Room',
      people_per_room: 2,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
    })
    const rooms: Room[] = [room]
    const res = filterByAccessability({ is_suitable_for_disability })(rooms)
    expect(res.length).toBe(0)
  })

  it('should filter out rooms unqualified', async () => {
    const is_suitable_for_disability = false
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 2,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
    })
    const rooms: Room[] = [room]
    const res = filterByAccessability({ is_suitable_for_disability })(rooms)
    expect(res.length).toBe(1)
  })
})

describe('testing the offer function filterByRoomType()', () => {
  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_room_type_preference: true, has_single_room: true, has_double_room: false }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = filterByRoomType(roomPreferences)(rooms)
    expect(res.length).toBe(1)
  })

  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_room_type_preference: true, has_single_room: false, has_double_room: true }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = filterByRoomType(roomPreferences)(rooms)
    expect(res.length).toBe(0)
  })

  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_room_type_preference: false, has_single_room: false, has_double_room: true }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = filterByRoomType(roomPreferences)(rooms)
    expect(res.length).toBe(1)
  })
})

describe('testing the offer function filterByFacility()', () => {
  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_private_toilet: true, has_private_bathroom: false }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = filterByFacility(roomPreferences)(rooms)
    expect(res.length).toBe(0)
  })

  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_private_toilet: true, has_private_bathroom: false }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,

    })
    const rooms: Room[] = [room]
    const res = filterByFacility(roomPreferences)(rooms)
    expect(res.length).toBe(1)
  })

  it('should filter out rooms unqualified', async () => {
    const roomPreferences = { has_private_toilet: true, has_private_bathroom: true }
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,

    })
    const rooms: Room[] = [room]
    const res = filterByFacility(roomPreferences)(rooms)
    expect(res.length).toBe(0)
  })
})

describe('testing the offer function filterByPrice()', () => {
  it('should filter out rooms unqualified', async () => {
    const rent_to = undefined
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = filterByPrice({ rent_to })(rooms)
    expect(res.length).toBe(1)
  })

  it('should filter out rooms unqualified', async () => {
    const rent_to = 1990
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,

    })
    const rooms: Room[] = [room]
    const res = filterByPrice({ rent_to })(rooms)
    expect(res.length).toBe(0)
  })

  it('should filter out rooms unqualified', async () => {
    const rent_to = 3200
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,

    })
    const rooms: Room[] = [room]
    const res = filterByPrice({ rent_to })(rooms)
    expect(res.length).toBe(1)
  })
})

describe('testing the offer function pickNonIdenticalRooms()', () => {
  it('should pick non identical rooms', async () => {
    const rent_to = undefined
    const room: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,

    })
    const rooms: Room[] = [room]
    const res = pickNonIdenticalRooms(rooms)
    expect(res.length).toBe(1)
  })

  it('should pick non identical rooms', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })

    const rooms: Room[] = [room_1, room_2]
    const res = pickNonIdenticalRooms(rooms)
    expect(res.length).toBe(1)
  })

  it('should pick non identical rooms', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2001,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_3: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const rooms: Room[] = [room_1, room_2, room_3]
    const res = pickNonIdenticalRooms(rooms)
    expect(res.length).toBe(2)
  })
})

describe('testing function pickRoomsByScore()', () => {
  it('should return proper data', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2001,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_3: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const rooms: Room[] = [room_1, room_2, room_3]
    const userScore: UserScore = await UserScore.generateUserScore({
      iduser: '4',
      agreeableness: 1,
      conscientiousness: 1,
      emotional_stability: 1,
      extroversion: 1,
      openness: 1,
      activity: 1,
      conformity: 1,
      engagement: 1,
      hedonism: 1,
      humanism: 1,
      performance: 1,
      power: 1,
      safety: 1,
      tradition: 1,
    })
    const tenantScore_1 = await UserScore.generateUserScore({
      iduser: '1',
      agreeableness: 1,
      conscientiousness: 1,
      emotional_stability: 1,
      extroversion: 1,
      openness: 1,
      activity: 1,
      conformity: 1,
      engagement: 1,
      hedonism: 1,
      humanism: 1,
      performance: 1,
      power: 1,
      safety: 1,
      tradition: 1,
    })
    const tenantScore_2 = await UserScore.generateUserScore({
      iduser: '2',
      agreeableness: 6,
      conscientiousness: 6,
      emotional_stability: 6,
      extroversion: 6,
      openness: 6,
      activity: 6,
      conformity: 6,
      engagement: 6,
      hedonism: 6,
      humanism: 6,
      performance: 6,
      power: 6,
      safety: 6,
      tradition: 6,
    })
    const tenants: ITenantWithScore[] = [
      {
        ...tenantScore_1,
        apartment_id: 1,
        room_id: 1,
      },
      {
        ...tenantScore_2,
        apartment_id: 1,
        room_id: 2,
      }]
    const result = pickRoomsByScore(rooms)(userScore, tenants)
    expect(result[0].facade_id).toBe(1)
    expect(result[0].score).toBe(5)
  })

  it('should return 0 as score with generator', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2001,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_3: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const rooms: Room[] = [room_1, room_2, room_3]
    const userScore: UserScore = await UserScore.generateUserScore({
      iduser: '4',
      agreeableness: 6,
      conscientiousness: 6,
      emotional_stability: 6,
      extroversion: 6,
      openness: 6,
      activity: 6,
      conformity: 6,
      engagement: 6,
      hedonism: 6,
      humanism: 6,
      performance: 6,
      power: 6,
      safety: 6,
      tradition: 6,
    })
    const tenantScore_1 = await UserScore.generateUserScore({
      iduser: '1',
      agreeableness: 6,
      conscientiousness: 6,
      emotional_stability: 6,
      extroversion: 6,
      openness: 6,
      activity: 6,
      conformity: 6,
      engagement: 6,
      hedonism: 6,
      humanism: 6,
      performance: 6,
      power: 6,
      safety: 6,
      tradition: 6,
    })
    const tenants: ITenantWithScore[] = [
      {
        ...tenantScore_1,
        apartment_id: 1,
        room_id: 1,
      }]

    const result = pickRoomsByScore(rooms)(userScore, tenants)
    expect(result[0].facade_id).toBe(1)
    expect(result[0].score).toBe(0)
  })

  it('should return 10 as score with generator', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2001,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_3: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const rooms: Room[] = [room_1, room_2, room_3]
    const userScore: UserScore = await UserScore.generateUserScore({
      iduser: '4',
      agreeableness: 1,
      conscientiousness: 1,
      emotional_stability: 1,
      extroversion: 1,
      openness: 1,
      activity: 1,
      conformity: 1,
      engagement: 1,
      hedonism: 1,
      humanism: 1,
      performance: 1,
      power: 1,
      safety: 1,
      tradition: 1,
    })
    const tenantScore_1 = await UserScore.generateUserScore({
      iduser: '1',
      agreeableness: 6,
      conscientiousness: 6,
      emotional_stability: 6,
      extroversion: 6,
      openness: 6,
      activity: 6,
      conformity: 6,
      engagement: 6,
      hedonism: 6,
      humanism: 6,
      performance: 6,
      power: 6,
      safety: 6,
      tradition: 6,
    })
    const tenants: ITenantWithScore[] = [
      {
        ...tenantScore_1,
        apartment_id: 1,
        room_id: 1,
      }]

    const result = pickRoomsByScore(rooms)(userScore, tenants)
    expect(result[0].facade_id).toBe(1)
    expect(result[0].score).toBe(10)
  })

  it('should return 4 as score with generator', async () => {
    const room_1: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_2: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2001,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const room_3: Room = await Room.generateRoom({
      apartment_id: 1,
      facade_id: 1,
      address_id: 1,
      name: 'Room',
      people_per_room: 1,
      rent: 2000,
      size: 20,
      number: '1201',
      service_fee: 1200,
      shared_area_size: 10,
      has_private_toilet: true,
    })
    const rooms: Room[] = [room_1, room_2, room_3]
    const userScore: UserScore = await UserScore.generateUserScore({
      iduser: '4',
      agreeableness: 5,
      conscientiousness: 5,
      emotional_stability: 5,
      extroversion: 5,
      openness: 5,
      activity: 5,
      conformity: 5,
      engagement: 5,
      hedonism: 5,
      humanism: 5,
      performance: 5,
      power: 5,
      safety: 5,
      tradition: 5,
    })
    const tenantScore_1 = await UserScore.generateUserScore({
      iduser: '1',
      agreeableness: 3,
      conscientiousness: 3,
      emotional_stability: 3,
      extroversion: 3,
      openness: 3,
      activity: 3,
      conformity: 3,
      engagement: 3,
      hedonism: 3,
      humanism: 3,
      performance: 3,
      power: 3,
      safety: 3,
      tradition: 3,
    })
    const tenants: ITenantWithScore[] = [
      {
        ...tenantScore_1,
        apartment_id: 1,
        room_id: 1,
      }]

    const result = pickRoomsByScore(rooms)(userScore, tenants)
    expect(result[0].facade_id).toBe(1)
    expect(result[0].score).toBe(4)
  })
})

describe('testing the offer function aggregateRawUserScore', () => {
  it('should give the structured userScore', async () => {
    const data = [
      {
        type: 'boolean',
        boolean: true,
        field: {
          id: 'mALndoALJzwr',
          type: 'legal',
          ref: '84b3c8ef-93b5-41b9-868c-478b5d81dd59',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'wEFggvv09unW',
          type: 'opinion_scale',
          ref: 'extroversion_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Hs2awDMp23rh',
          type: 'opinion_scale',
          ref: 'performance_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '8g1fVUUtW8z5',
          type: 'opinion_scale',
          ref: 'agreeableness_1_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'j7hdVAKAdXSZ',
          type: 'opinion_scale',
          ref: 'power_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Uk6Fr1zotXtn',
          type: 'opinion_scale',
          ref: 'conscientiousness_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'rnKffobJSai3',
          type: 'opinion_scale',
          ref: 'activity_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'k3dGPPL10H9v',
          type: 'opinion_scale',
          ref: 'openness_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Kn4xBYvDodha',
          type: 'opinion_scale',
          ref: 'hedonism_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'UHSn6rxqFFol',
          type: 'opinion_scale',
          ref: 'emotional_stability_1_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Mylo0ZUM6Kwx',
          type: 'opinion_scale',
          ref: 'tradition_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'cqRXBX4vu3Vw',
          type: 'opinion_scale',
          ref: 'extroversion_2_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '0Tl1ZuU8EQfu',
          type: 'opinion_scale',
          ref: 'safety_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'NsB0OZSkM64d',
          type: 'opinion_scale',
          ref: 'agreeableness_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'w0E91Pe4Yg9O',
          type: 'opinion_scale',
          ref: 'humanism_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'QXHA2ekTEjvR',
          type: 'opinion_scale',
          ref: 'conscientiousness_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'EGAFLdZVj5XU',
          type: 'opinion_scale',
          ref: 'conformity_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'VQkaAMvfXGhZ',
          type: 'opinion_scale',
          ref: 'openness_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'q4EivV5PRd3t',
          type: 'opinion_scale',
          ref: 'engagement_1',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'vXKmsNpPtvbW',
          type: 'opinion_scale',
          ref: 'emotional_stability_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'VFWhKAoG2QCN',
          type: 'opinion_scale',
          ref: 'performance_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'UgmMJFNwSyMV',
          type: 'opinion_scale',
          ref: 'extroversion_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'TLadGU1ysYDM',
          type: 'opinion_scale',
          ref: 'power_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'zO4UgMf0yuBn',
          type: 'opinion_scale',
          ref: 'agreeableness_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'IXfEKOJsUSCk',
          type: 'opinion_scale',
          ref: 'activity_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'nokxGyxqoQqL',
          type: 'opinion_scale',
          ref: 'conscientiousness_3_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'RgCaSZnKmfIG',
          type: 'opinion_scale',
          ref: 'hedonism_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Y7fXFRTypD3h',
          type: 'opinion_scale',
          ref: 'openness_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'SiEzp3ILMAl5',
          type: 'opinion_scale',
          ref: 'tradition_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'wy6VqW3Cu8Yd',
          type: 'opinion_scale',
          ref: 'emotional_stability_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 't0u6MEH6o1E3',
          type: 'opinion_scale',
          ref: 'safety_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'UCgUZwnYCf6U',
          type: 'opinion_scale',
          ref: 'extroversion_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Tj2wc4SbevF1',
          type: 'opinion_scale',
          ref: 'humanism_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'oieTbR18EHf4',
          type: 'opinion_scale',
          ref: 'agreeableness_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'YEIIxjf2Yz86',
          type: 'opinion_scale',
          ref: 'conformity_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'CmVkvHm70wBJ',
          type: 'opinion_scale',
          ref: 'conscientiousness_4',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'mnWOSCYXRv00',
          type: 'opinion_scale',
          ref: 'engagement_2',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'KRPAksFA8qYy',
          type: 'opinion_scale',
          ref: 'openness_4',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'LEstqMgcWfIU',
          type: 'opinion_scale',
          ref: 'performance_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'RT1oYb4sZpsi',
          type: 'opinion_scale',
          ref: 'emotional_stability_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'qNI4D6rwQhaH',
          type: 'opinion_scale',
          ref: 'power_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'MJwX7scv2blP',
          type: 'opinion_scale',
          ref: 'extroversion_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'r9yg9okouwQX',
          type: 'opinion_scale',
          ref: 'activity_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'AyyOI0ZCixgF',
          type: 'opinion_scale',
          ref: 'agreeableness_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'gCeXiOD22lxF',
          type: 'opinion_scale',
          ref: 'hedonism_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'PAYgXntZv4ZE',
          type: 'opinion_scale',
          ref: 'conscientiousness_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'BNvFNYazZR37',
          type: 'opinion_scale',
          ref: 'tradition_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Pj2xTnYlFlE0',
          type: 'opinion_scale',
          ref: 'openness_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'wtwaiZKBUM8r',
          type: 'opinion_scale',
          ref: 'safety_3_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'kC94jwxRywl4',
          type: 'opinion_scale',
          ref: 'emotional_stability_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'EcBZaGVREnQ3',
          type: 'opinion_scale',
          ref: 'humanism_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'VzAiisZx4PKA',
          type: 'opinion_scale',
          ref: 'extroversion_6_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '2pNgxSj28t5J',
          type: 'opinion_scale',
          ref: 'conformity_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'UgU6HgQFKt2m',
          type: 'opinion_scale',
          ref: 'agreeableness_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'iO1JVBFI8ZH6',
          type: 'opinion_scale',
          ref: 'engagement_3',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'OW1xZ7t5qhyA',
          type: 'opinion_scale',
          ref: 'conscientiousness_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'taKP7wZDPzfW',
          type: 'opinion_scale',
          ref: 'performance_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'tF7xt4oJMAMo',
          type: 'opinion_scale',
          ref: 'openness_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'lrNPwtPHr1ro',
          type: 'opinion_scale',
          ref: 'power_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'zKqwGg6Lrlq4',
          type: 'opinion_scale',
          ref: 'emotional_stability_6_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'gga08SrqchWt',
          type: 'opinion_scale',
          ref: 'activity_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'hQeOqGzzJr3D',
          type: 'opinion_scale',
          ref: 'extroversion_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'X6lM24QY7Ulr',
          type: 'opinion_scale',
          ref: 'hedonism_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 't77nxEK6wS92',
          type: 'opinion_scale',
          ref: 'agreeableness_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '14OAuZRoWOIQ',
          type: 'opinion_scale',
          ref: 'tradition_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'mrXJq1SVuxXd',
          type: 'opinion_scale',
          ref: 'conscientiousness_7_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'PlJAPru5zyl1',
          type: 'opinion_scale',
          ref: 'safety_4',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '81F8g2xxyYJa',
          type: 'opinion_scale',
          ref: 'openness_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'iNV7zPVUsaI3',
          type: 'opinion_scale',
          ref: 'humanism_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Xfhbsigtyrxh',
          type: 'opinion_scale',
          ref: 'emotional_stability_7_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'w8f6cExgaIIa',
          type: 'opinion_scale',
          ref: 'conformity_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'uwFD7kF84Bly',
          type: 'opinion_scale',
          ref: 'extroversion_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'l6zaLIHsFzzq',
          type: 'opinion_scale',
          ref: 'engagement_4_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'R1Hm4wzFrB03',
          type: 'opinion_scale',
          ref: 'performance_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'FdgxzhQBKVlj',
          type: 'opinion_scale',
          ref: 'power_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'XSzv5DrTOLwB',
          type: 'opinion_scale',
          ref: 'agreeableness_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'h9ZY4F8mGiq5',
          type: 'opinion_scale',
          ref: 'activity_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'n9UUBCV0fYzB',
          type: 'opinion_scale',
          ref: 'conscientiousness_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'UZ2Ff9kyn544',
          type: 'opinion_scale',
          ref: 'openness_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'CaXVSclFa38x',
          type: 'opinion_scale',
          ref: 'hedonism_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'T8WaVmCmpcKf',
          type: 'opinion_scale',
          ref: 'tradition_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'TQURjmLDUKWA',
          type: 'opinion_scale',
          ref: 'emotional_stability_8_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'pNfsNSjHpfKa',
          type: 'opinion_scale',
          ref: 'safety_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'KZfFmMCQ3Opj',
          type: 'opinion_scale',
          ref: 'extroversion_9_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'S46OGWQ7afxU',
          type: 'opinion_scale',
          ref: 'humanism_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'xvWV6azrCItB',
          type: 'opinion_scale',
          ref: 'agreeableness_9',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'PIZfv5ts3yvi',
          type: 'opinion_scale',
          ref: 'conformity_5_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'zu1S9W2ULNGA',
          type: 'opinion_scale',
          ref: 'conscientiousness_9',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '1YUJRpmUtIlX',
          type: 'opinion_scale',
          ref: 'engagement_5',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'n7PUIPngiBHs',
          type: 'opinion_scale',
          ref: 'openness_9',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'T76CdLhXFReA',
          type: 'opinion_scale',
          ref: 'performance_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'fP05ysvuqrW5',
          type: 'opinion_scale',
          ref: 'emotional_stability_9_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'fjqW7ymFWmFq',
          type: 'opinion_scale',
          ref: 'power_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'ffZBn9UR6WoJ',
          type: 'opinion_scale',
          ref: 'extroversion_10',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'SGjawbhvXWoE',
          type: 'opinion_scale',
          ref: 'activity_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'pcwfO0U4HtSs',
          type: 'opinion_scale',
          ref: 'agreeableness_10_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'J5vMPMbpcz7D',
          type: 'opinion_scale',
          ref: 'hedonism_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'nun4V1JmQhcR',
          type: 'opinion_scale',
          ref: 'conscientiousness_10_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'E5FBPZyHaMgZ',
          type: 'opinion_scale',
          ref: 'tradition_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'U7DxvUgnUeH5',
          type: 'opinion_scale',
          ref: 'openness_10',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '7KT8eC3J0uAh',
          type: 'opinion_scale',
          ref: 'safety_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '1Nm67IOHAOgx',
          type: 'opinion_scale',
          ref: 'emotional_stability_10_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'czuNWJvyexZh',
          type: 'opinion_scale',
          ref: 'humanism_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'kFUBzSf9YRZo',
          type: 'opinion_scale',
          ref: 'extroversion_11',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'jG6RhyK51bnJ',
          type: 'opinion_scale',
          ref: 'conformity_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'ly2gNaU6Yn6D',
          type: 'opinion_scale',
          ref: 'agreeableness_11',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'H9UGDi8OlqB8',
          type: 'opinion_scale',
          ref: 'engagement_6',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'SfrSflr1D0Yb',
          type: 'opinion_scale',
          ref: 'conscientiousness_11',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'NmCTk3JLWZXT',
          type: 'opinion_scale',
          ref: 'performance_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'HjlKMyyPchWv',
          type: 'opinion_scale',
          ref: 'openness_11_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '52zEhw4BweO8',
          type: 'opinion_scale',
          ref: 'emotional_stability_11_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'pYFM8cMG5BYu',
          type: 'opinion_scale',
          ref: 'power_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'Ff20IJiq6YW9',
          type: 'opinion_scale',
          ref: 'extroversion_12',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'xxP9Ji2FWyLX',
          type: 'opinion_scale',
          ref: 'activity_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'hcNbnkZChhZU',
          type: 'opinion_scale',
          ref: 'agreeableness_12_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'X6gYcDwPRbZh',
          type: 'opinion_scale',
          ref: 'hedonism_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'ZgGyTOYjnuCj',
          type: 'opinion_scale',
          ref: 'conscientiousness_12',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '1cMBnUynSaeK',
          type: 'opinion_scale',
          ref: 'tradition_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'DNvjaNVBg7WR',
          type: 'opinion_scale',
          ref: 'openness_12',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'edsLj814KDQa',
          type: 'opinion_scale',
          ref: 'safety_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '9iJOIjWxiOa1',
          type: 'opinion_scale',
          ref: 'emotional_stability_12',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'twZoRWa2sibM',
          type: 'opinion_scale',
          ref: 'humanism_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'PFJ3W4Rq7xyh',
          type: 'opinion_scale',
          ref: 'conformity_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'BKTkG9YHDej1',
          type: 'opinion_scale',
          ref: 'engagement_7',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'HpYumb5TH0Sl',
          type: 'opinion_scale',
          ref: 'performance_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'JxPpsYmfFsHc',
          type: 'opinion_scale',
          ref: 'power_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'jr40MhL12374',
          type: 'opinion_scale',
          ref: 'activity_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '9m4kbiGotUWH',
          type: 'opinion_scale',
          ref: 'hedonism_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'BZgUPkaQUOaB',
          type: 'opinion_scale',
          ref: 'tradition_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'PDvV5fjkehGi',
          type: 'opinion_scale',
          ref: 'safety_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'JgB2JnfsGszk',
          type: 'opinion_scale',
          ref: 'humanism_8_inverted',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: '8iklwfyFhNr2',
          type: 'opinion_scale',
          ref: 'conformity_8',
        },
      },
      {
        type: 'number',
        number: 5,
        field: {
          id: 'dSap8As7Bgbv',
          type: 'opinion_scale',
          ref: 'engagement_8',
        },
      },
    ]
    const result = aggregateRawUserScore(data)
    expect(result.agreeableness).toBe(4)
  })
})
