import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserProfilesForExistingUsers1572276753301 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query('INSERT INTO user_profiles (iduser) SELECT iduser FROM "user"')
  }

  public async down(): Promise<any> {
    return
  }
}
