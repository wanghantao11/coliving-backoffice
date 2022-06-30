import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { LabelDao } from './../../domain/dao'
import { Label } from '../../domain/entity'

@injectable()
export class LabelService {
  constructor(
    @inject('LabelDao') private labelDao: LabelDao
  ) {}

  public createLabel = (label: Label) => this.labelDao.createLabel(label)

  public deleteLabel = (id: string) => this.labelDao.deleteLabel(Number(id))

  public getLabelsByFacadeId = (id: string) => this.labelDao.getLabelsByFacadeId(Number(id))

  public updateLabel = (id: string, data: Partial<Label>) => this.labelDao.updateLabel(Number(id), data)
}
