import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { LabelDao } from './../../domain/dao'
import { Label } from './../../domain/entity'

@injectable()
export class LabelRepository implements LabelDao {
  private readonly REPO_NAME = 'label'

  public createLabel = (label: Label): Promise<Label> =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Label)
      .values({ ...label })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteLabel = (id: number) =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getLabel = (id: number) =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getLabels = (ids: number[]) =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id IN (:...ids)', { ids })
      .getMany()

  public getLabelsByFacadeId = (id: number) =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :id', { id })
      .getMany()

  public updateLabel = (id: number, data: Partial<Label>) =>
    getRepository(Label, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
