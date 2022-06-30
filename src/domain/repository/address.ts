import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { AddressDao } from './../../domain/dao/address.dao'
import { Address } from './../../domain/entity/address'

@injectable()
export class AddressRepository implements AddressDao {
  private readonly REPO_NAME = 'address'

  public createAddress = (address: Address): Promise<Address> =>
    getRepository(Address, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Address)
      .values({ ...address })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteAddress = (id: number) =>
    getRepository(Address, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getAddress = (id: number) =>
    getRepository(Address, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getAddressesByFacadeId = (id: number) =>
    getRepository(Address, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :id', { id })
      .getMany()

  public updateAddress = (id: number, data: Partial<Address>) =>
    getRepository(Address, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
