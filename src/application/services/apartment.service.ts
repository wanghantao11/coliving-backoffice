import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { ApartmentDao } from './../../domain/dao'
import { Apartment } from '../../domain/entity'

@injectable()
export class ApartmentService {
  constructor(
    @inject('ApartmentDao') private apartmentDao: ApartmentDao
  ) {}

  public createApartment = (apartment: Apartment) => this.apartmentDao.createApartment(apartment)

  public deleteApartment = (id: string) => this.apartmentDao.deleteApartment(Number(id))

  public getApartmentsByFacadeId = (id: string) => this.apartmentDao.getApartmentsByFacadeId(Number(id))

  public updateApartment = (id: string, data: Partial<Apartment>) => this.apartmentDao.updateApartment(Number(id), data)
}
