export interface ISearchOfferLog {
  // stats of available rooms through whole process
  total_available?: number
  after_orphan_check?: number
  after_accessability_filter?: number
  after_room_type_filter?: number
  after_facility_filter?: number
  after_price_filter?: number
  after_rejected_offers?: number
  after_picking_by_score?: number
}

export interface IErrorLog {
  message: string
  reason?: string
  data?: any
}
