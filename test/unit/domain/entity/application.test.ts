import { Application } from './../../../../src/domain/entity'
describe('testing AppliedAccommodation entity', () => {
  it('should creata a AppliedAccmmodation entity', () => {
    // Arrange
    // Act
    const actual = new Application('e59f1c57-3413-42bf-a3b2-cee34f3df64a', 23, 2)
    // Assert
    expect(actual).toBeInstanceOf(Application)
    expect(actual.id).not.toBeDefined()
    expect(actual.iduser).toBe('e59f1c57-3413-42bf-a3b2-cee34f3df64a')
  })
})
