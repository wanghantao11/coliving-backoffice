import { injectable } from 'inversify'
import { DeleteResult, getRepository } from 'typeorm'
import { AdminDao } from './../dao/admin.dao'
import { Admin } from './../../domain/entity/admin'
import { IAdminFilter } from '../../interfaces/admin'

@injectable()
export class AdminRepository implements AdminDao {
  private readonly REPO_NAME = 'admin'

  public createAdmin = (admin: Admin): Promise<Admin> =>
    getRepository(Admin, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Admin)
      .values({ ...admin })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteAdmin = (id: number): Promise<DeleteResult> =>
    getRepository(Admin, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('"id" = :id ', { id })
      .delete()
      .execute()

  public getAdminBy = (filter: IAdminFilter) => {
    const { email, id } = filter
    const queries = []
    if (email) {
      queries.push(`admin.email = '${email}'`)
    }
    if (id) {
      queries.push(`admin.id = '${id}'`)
    }
    return getRepository(Admin, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoinAndMapOne('admin.role', 'admin.role_id', 'role')
      .leftJoinAndMapOne('admin.client', 'admin.client_id', 'client')
      .select([
        'admin.id',
        'admin.created_at',
        'admin.updated_at',
        'admin.first_name',
        'admin.last_name',
        'admin.language',
        'admin.email',
        'admin.img_url',
        'admin.type',
        'admin.verified',
        'admin.password',
        'admin.facade_ids',
        'admin.verification_code',
      ])
      .addSelect('client.id')
      .addSelect(['role.id', 'role.name'])
      .where(queries.join(' AND '))
      .getOne()
  }

  public getAdminsBy = (filter: IAdminFilter = {}) => {
    const { clientId, roles = [], facadeIds = [], verified } = filter
    const queries = []
    if (clientId) {
      queries.push(`admin.client_id = '${clientId}'`)
    }
    if (roles.length !== 0) {
      queries.push(`role.name = ANY('{${roles.join(',')}}')`)
    }
    if (facadeIds.length !== 0) {
      queries.push(`(admin.facade_ids && '{${facadeIds.join(',')}}' OR admin.facade_ids IS NULL)`)
    }
    if (verified) {
      queries.push(`admin.verified = ${verified}`)
    }

    return getRepository(Admin, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoinAndMapOne('admin.role', 'admin.role_id', 'role')
      .select([
        'admin.id',
        'admin.created_at',
        'admin.updated_at',
        'admin.first_name',
        'admin.last_name',
        'admin.language',
        'admin.email',
        'admin.img_url',
        'admin.type',
        'admin.verified',
      ])
      .addSelect(['role.id', 'role.name'])
      .where(queries.join(' AND '))
      .orderBy({ 'admin.created_at': 'ASC' })
      .getMany()
  }

  public updateAdminBy = (filter: IAdminFilter, data: Partial<Admin>) => {
    const { id, email } = filter
    const queries = []
    if (id) {
      queries.push(`admin.id = '${id}'`)
    }
    if (email) {
      queries.push(`admin.email = '${email}'`)
    }
    return getRepository(Admin, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .execute()
      .then(res => res.raw[0])
  }
}
