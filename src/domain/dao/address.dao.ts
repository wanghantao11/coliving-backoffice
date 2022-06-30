import { Address } from './../entity'

export interface AddressDao {
  createAddress(address: Address)
  updateAddress(id: number, data: Partial<Address>)
  deleteAddress(id: number)
  getAddress(id: number)
  getAddressesByFacadeId(id: number)
}
