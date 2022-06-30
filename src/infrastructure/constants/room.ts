export enum PERIOD_OF_STAY {
  THREE_TO_SIX_MONTHS = 'THREE_TO_SIX_MONTHS',
  SIX_MONTHS_TO_ONE_YEAR = 'SIX_MONTHS_TO_ONE_YEAR',
  ONE_TO_THREE_YEARS = 'ONE_TO_THREE_YEARS',
  MORE_THAN_THREE_YEARS = 'MORE_THAN_THREE_YEARS',
  NOT_SPECIFIED = 'NOT_SPECIFIED',
}

export enum ROOM_STATUS {
  AVAILABLE = 'Available', // Room is vacant for assignment
  RESERVED = 'Reserved', // Room is reserved and waiting for candidate response
  OCCUPIED = 'Occupied', // Room is occupied by tenant(s)
  OUT_OF_SERVICE = 'Out of service', // Room is vacant due to service issues
}

export enum OFFER_STATUS {
  PENDING = 'Pending', // offer is sent
  ACCEPTED = 'Accepted', // offer is accepted
  REJECTED = 'Rejected', // offer is rejected
}
