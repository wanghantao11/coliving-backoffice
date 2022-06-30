export interface IMailchimpMergeFields {
  FNAME: string
  LNAME: string
  BIRTHDAY: string
  REGTIME: string
}

export interface IMailchimpContact {
  email_address: string
  merge_fields: Partial<IMailchimpMergeFields>
  interests: object
  tags: object
  status: string
}

export interface IMailchimpBatchOperation {
  method: string
  path: string
  params?: string
  body: string
  operation_id?: string
}
