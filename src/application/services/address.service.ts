import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { AddressDao } from './../../domain/dao'
import { Address } from '../../domain/entity'

@injectable()
export class AddressService {
  constructor(
    @inject('AddressDao') private addressDao: AddressDao
  ) {}

  public createAddress = (address: Address) => this.addressDao.createAddress(address)

  public getAddressesByFacadeId = (id: string) => this.addressDao.getAddressesByFacadeId(Number(id))

  public updateAddress = (id: string, data: Partial<Address>) => this.addressDao.updateAddress(Number(id), data)

  public deleteAddress = (id: string) => this.addressDao.deleteAddress(Number(id))
}
