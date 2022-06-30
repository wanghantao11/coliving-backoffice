import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserProfilesForExistingUsers1582896836478 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query('INSERT INTO user_profiles (iduser) SELECT iduser FROM "user" ON CONFLICT DO NOTHING')
  }

  public async down(): Promise<any> {
    return
  }
}
