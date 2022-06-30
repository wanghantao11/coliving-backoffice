import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserPreferencesForExistingUsers1582884910525 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query('INSERT INTO user_preferences (iduser) SELECT user_key FROM "user" ON CONFLICT DO NOTHING')
  }

  public async down(): Promise<any> {
    return
  }
}
