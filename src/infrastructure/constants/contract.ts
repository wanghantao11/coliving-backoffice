export enum CONTRACT_STATUS {
  PENDING = 'Pending', // Initial status, draft contract is created
  SIGNED = 'Signed', // Contract is signed by the target member(s)
  ACTIVE = 'Active', // Contract is signed by all signatories and become active
  REJECTED = 'Rejected', // Member(s) choose to not sign contract
  TERMINATED = 'Terminated', // Contract is terminated
  EXPIRED = 'Expired', // Contract has naturally reached its end date.
}

export enum CONTRACT_DOCUMENT_TYPE {
  EMPLOYMENT_CERTIFICATE = 'employment_certificate',
  REFERENCE = 'reference',
  HOME_INSURANCE = 'home_insurance',
  ICE = 'ice',
  IDENTITY = 'identity',
  BANK_STATEMENT = 'bank_statement',
}

/**
 * The list should includes all the external_keys of data field that will be used in every project
 *
 * @see https://paper.dropbox.com/doc/Data-fields-in-OneFlow--A1PV~Ed_yk_UdKSILEizuK9DAg-1nU6Q0dTJCodeXbewDK0h
 */
export const CONTRACT_SHARED_EXTERNAL_KEYS: string[] = [
  'bankgiro',
  'coliving_hub',
  'deposit',
  'deposit_pay_date',
  'member_1_fullname',
  'member_1_pers_number',
  'member_1_address_street',
  'member_1_address_zip',
  'member_1_address_area',
  'member_1_email',
  'member_2_fullname',
  'member_2_pers_number',
  'member_2_address_street',
  'member_2_address_zip',
  'member_2_address_area',
  'member_2_email',
  'move_in_date',
  'org_name',
  'org_number',
  'org_address_street',
  'org_address_zip',
  'org_address_area',
  'org_email',
  'project_name',
  'property_unit_designation',
  'rent_service_increase_date',
  'rent_service_increase_perc',
  'unit_address_area',
  'unit_address_street',
  'unit_address_zip',
  'unit_floor',
  'unit_lgh_number',
  'unit_rent',
  'unit_rent_billing_date',
  'unit_service_fee',
  'unit_service_billing_date',
  'unit_shared_size',
  'unit_size',
  'unit_type',
  'unit_type_max',
  'unit_type_max_descr',
]

export const SWEDISH_BANKID_SIGN_METHOD_ID = 2
export const NO_DELIVERY = 4
export const SIGN_KEY = process.env.CONTRACT_SERVICE_SIGN_KEY

/**
 * @see https://app.oneflow.com/api/docs/webhooks/agreement_event.html#agreement-events
 */
export const EVENT_CONTRACT_STATUS_MAPPING = {
  2: CONTRACT_STATUS.SIGNED, // TYPE_AGREEMENT_SIGN
  4: CONTRACT_STATUS.SIGNED, // TYPE_PARTICIPANT_SIGN
  5: CONTRACT_STATUS.REJECTED, // TYPE_PARTICIPANT_DECLINE
  17: CONTRACT_STATUS.REJECTED, // TYPE_AGREEMENT_EXPIRE(overdue)
  21: CONTRACT_STATUS.TERMINATED, // TYPE_AGREEMENT_CANCEL
  14: CONTRACT_STATUS.EXPIRED, // TYPE_LIFECYCLE_END
  22: CONTRACT_STATUS.EXPIRED, // TYPE_LIFECYCLE_TERMINATE
  26: CONTRACT_STATUS.PENDING, // TYPE_PARTICIPANT_UPDATE
  39: CONTRACT_STATUS.PENDING, // TYPE_BOX_UPDATE
}

export const UNIT_TYPE = { 1: 'Standardrum (1 pers)', 2: 'Dubbelrum (2 pers)' }
export const UNIT_TYPE_MAX_DESCR = { 1: 'standardrum för högst en (1) person', 2: 'dubbelrum för högst två (2) personer' }
export const UNIT_TYPE_MAX = { 1: 'en (1) person', 2: 'två (2) personer' }
