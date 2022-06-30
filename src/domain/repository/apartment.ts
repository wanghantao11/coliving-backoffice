import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ApartmentDao } from './../../domain/dao/apartment.dao'
import { Apartment } from './../../domain/entity/apartment'

@injectable()
export class ApartmentRepository implements ApartmentDao {
  private readonly REPO_NAME = 'apartment'

  public createApartment = (apartment: Apartment): Promise<Apartment> =>
    getRepository(Apartment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Apartment)
      .values({ ...apartment })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteApartment = (id: number) =>
    getRepository(Apartment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getApartment = (id: number) =>
    getRepository(Apartment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getApartmentsByFacadeId = (id: number) =>
    getRepository(Apartment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :id', { id })
      .getMany()

  public updateApartment = (id: number, data: Partial<Apartment>) =>
    getRepository(Apartment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
