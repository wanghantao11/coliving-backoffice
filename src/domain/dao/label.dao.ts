import { Label } from './../entity'

export interface LabelDao {
  createLabel(label: Label)
  deleteLabel(id: number)
  getLabel(id: number)
  getLabels(ids: number[])
  getLabelsByFacadeId(id: number)
  updateLabel(id: number, data: Partial<Label>)
}
