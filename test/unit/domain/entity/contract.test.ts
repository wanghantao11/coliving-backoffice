import { Contract } from '../../../../src/domain/entity'
import { CONTRACT_STATUS } from '../../../../src/infrastructure/constants'

describe('testing the contract entity', () => {
  it('should create a contract entity with minimum properties', async () => {
    const actual = await Contract.generateContract({
      iduser: 's4i1dhB1krbJyrvwkDG152Y5eI80',
      room_id: 20,
      facade_id: 1,
      status: CONTRACT_STATUS.PENDING,
    })

    expect(actual).toBeInstanceOf(Contract)
  })

  it('should create a contract entity with all properties', async () => {
    const actual = await Contract.generateContract({
      iduser: 's4i1dhB1krbJyrvwkDG152Y5eI80',
      room_id: 20,
      facade_id: 1,
      status: CONTRACT_STATUS.PENDING,
      external_id: 2302,
      start_date: new Date(),
      end_date: new Date(),
    })

    expect(actual).toBeInstanceOf(Contract)
    expect(actual.room_id).toBe(20)
    expect(actual.status).toBe(CONTRACT_STATUS.PENDING)
    expect(actual.external_id).toBe(2302)
  })
})
