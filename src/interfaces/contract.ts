import { Contract } from '../domain/entity'
import { CONTRACT_STATUS } from '../infrastructure/constants'

export interface IContractData {
  // user
  iduser: string
  first_name: string
  last_name: string
  email: string
  phone: string
  // userPreferences
  user_move_in_date?: Date
  // projectFacade
  project_name: string
  facade_id: number
  landlord_name: string
  landlord_email: string
  landlord_org_no: string
  landlord_street: string
  landlord_zip: string
  landlord_post_area: string
  property_unit_designation: string
  coliving_hub: string
  post_area: string
  is_auto_offer_flow?: boolean
  // projectFacadeBilling
  bankgiro_no: string
  deposit: number
  deposit_refund_weeks: number
  rent_yearly_increase_rate: number
  rent_yearly_increase_date: Date
  rent_day_of_month: number
  service_fee_day_of_month: number
  // contractTemplates
  extra_fields: any
  // room
  room_id: number
  number: string
  people_per_room: number
  size: number
  shared_area_size: number
  floor_no: string
  street: string
  zip: string
  rent: number
  service_fee: number
  room_move_in_date?: Date
  // collection
  collection_id: number
  // common
  move_in_date: Date
}

export interface IOneflowResponse {
  callback_id: string
  signature: string
  agreement: object
  agreement_id: number
  account: object
  events: any[]
}

export interface ITemplate {
  id: number
  name: string
  template_group_id: number
}

export interface IParticipant extends Contract {
  email: string
  first_name: string
}

export interface IContractFilter {
  id?: number
  iduser?: string
  roomIds?: number[]
  participantId?: number
  externalId?: number
  status?: CONTRACT_STATUS[]
}

export interface ITenancyFilter {
  room_id: number
  status?: CONTRACT_STATUS[]
  today: Date
}
