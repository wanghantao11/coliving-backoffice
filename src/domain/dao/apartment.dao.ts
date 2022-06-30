import { Apartment } from './../entity'

export interface ApartmentDao {
  createApartment(apartment: Apartment)
  updateApartment(id: number, data: Partial<Apartment>)
  deleteApartment(id: number)
  getApartment(id: number)
  getApartmentsByFacadeId(id: number)
}
