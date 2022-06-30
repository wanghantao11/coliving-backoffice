interface ITypeformField {
  id: string
  ref: string
  type: string
}

export interface ITypeformResponse {
  field: ITypeformField
  type: string
  number: number
}
