import { User } from '../../../../src/domain/entity/user'

describe('testing the user entity', () => {
  const userData = {
    client_id: 2,
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
  }

  it('should create a user entity', async () => {
    const actual = await User.generateUser(userData)

    expect(actual).toBeInstanceOf(User)
  })

  it('should create a user entity and test if there is mandatory properties', async () => {
    const actual = await User.generateUser(userData)

    expect(typeof actual.iduser).toBe('string')
    expect(actual.first_name.length).toBeGreaterThan(0)
    expect(actual.last_name.length).toBeGreaterThan(0)
    expect(actual.last_name).toBe('Last name')
    expect(actual.description).toBe('I am just a test user')
    expect(actual.tos_version_accepted).toBe(1)
    expect(actual.user_type).toBe('Light')
  })
})
