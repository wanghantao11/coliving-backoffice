import { Project } from '../../../../src/domain/entity/project'

describe('testing the project entity', () => {
  it('should create a project entity with minimum properties', async () => {
    // Arrange
    // Act
    const actual = await Project.generateProject({
      facade_id: 1,
      client_id: 1,
      name: 'COLIVE Test Project',
    })
    // Assert
    expect(actual).toBeInstanceOf(Project)
  })
})
