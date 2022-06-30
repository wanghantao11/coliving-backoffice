import axios from 'axios'
import { find } from 'lodash'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import {
  NO_DELIVERY,
  UNIT_TYPE,
  UNIT_TYPE_MAX,
  UNIT_TYPE_MAX_DESCR,
  EVENT_CONTRACT_STATUS_MAPPING,
  CONTRACT_SHARED_EXTERNAL_KEYS
} from '../constants/contract'
import { IContractData, IOneflowResponse, ITemplate, IParticipant } from '../../interfaces'

const contractAxios = axios.create({
  baseURL: process.env.CONTRACT_SERVICE_API,
})

contractAxios.interceptors.request.use(
  config => {
    const token = process.env.CONTRACT_SERVICE_API_TOKEN
    const position = process.env.CONTRACT_SERVICE_API_POSITION
    config.headers['Content-Type'] = 'application/json'
    config.headers['X-Flow-API-Token'] = token
    config.headers['X-Flow-Current-Position'] = position
    return config
  }
)

contractAxios.interceptors.response.use(response => response, ({ response: { data } }) =>
  /** @see https://app.oneflow.com/api/docs/api/error_handling.html?highlight=error  */
  Promise.reject({ message: 'INTERNAL_SERVER_ERROR', reason: 'Oneflow Request Error', detail: data.error })
)

export const generateContract = data =>
  contractAxios.post('/api/agreements/', JSON.stringify(data))

export const publishContract = externalId =>
  contractAxios.post(
    `/api/agreements/${externalId}/publish`,
    JSON.stringify({
      subject: 'COLIVE Avtal',
      message: 'Här är ditt kontrakt. Läs igenom det noggrant och signera när du känner dig redo! Kom ihåg att du har 5 dagar på dig.',
    })
  )

export const deleteContract = externalId =>
  contractAxios.delete(`/api/agreements/${externalId}`)

export const generateAccessToken = (externalId, participantId) =>
  contractAxios.post(
    `/api/agreements/${externalId}/participants/${participantId}/tokens`,
    JSON.stringify({})
  )

export const getTemplatesByCollectionId = collectionId =>
  contractAxios.get(`/api/templates/?collection_id[]=${collectionId}`)

export const getTemplateGroup = groupId =>
  contractAxios.get(`/api/ext/templategroups/${groupId}`)

export const getDataFieldsSet = setId =>
  contractAxios.get(`/api/data_field_sets/${setId}/fields/`)

export const getCollections = () => contractAxios.get('/api/collections/')

export const getContractPdf = agreementId => contractAxios.get(`/api/agreements/${agreementId}/assets/contract.pdf`)

export const checkIsContractDataReady = (contractData: IContractData): Promise<boolean> => {
  let isReady = true
  for (const key of Object.keys(contractData)) {
    if (!contractData[key]) {
      // move_in_date has to exist either in room or contract specific fields
      if (key === 'move_in_date' && contractData.extra_fields.move_in_date) {
        continue
      } else {
        isReady = false
        break
      }
    }
  }
  return Promise.resolve(isReady)
}

export const checkIsContractDataReadyForProject = (ListOfContractData: IContractData[]): Promise<boolean> =>
  Promise.all(ListOfContractData.map(checkIsContractDataReady))
    // if results include false, it means at least one room is not ready, thus false, otherwise true
    .then(results => !results.includes(false))

export const formatContract = (items: IContractData[], templates: ITemplate[]) => {
  const collection_id: number = items[0].collection_id
  const number_of_tenants: number = items.length
  const CONTRACT_TEMPLATE_MAP = {
    1: (find(templates, template => template.name.toLowerCase().includes('single')) || { id: undefined }).id,
    2: (find(templates, template => template.name.toLowerCase().includes('double')) || { id: undefined }).id,
  }
  const source_id: number = CONTRACT_TEMPLATE_MAP[number_of_tenants]

  if (!source_id) {
    return Promise.reject({ message: 'NOT_ALLOWED', reason: 'No valid source_id is found in templates' })
  }

  const parties = []
  const data = []

  const {
    first_name,
    last_name,
    email,
    phone,
    project_name,
    landlord_name,
    landlord_email,
    landlord_org_no,
    landlord_street,
    landlord_zip,
    landlord_post_area,
    property_unit_designation,
    coliving_hub,
    post_area,
    bankgiro_no,
    deposit,
    deposit_refund_weeks,
    rent_yearly_increase_rate,
    rent_yearly_increase_date,
    rent_day_of_month,
    service_fee_day_of_month,
    extra_fields,
    // tslint:disable-next-line:variable-name
    number,
    people_per_room,
    size,
    shared_area_size,
    floor_no,
    street,
    zip,
    rent,
    service_fee,
    move_in_date,
  } = items[0]
  const full_name = `${first_name} ${last_name}`
  parties.push({
    name: full_name,
    consumer: 1,
    participants: [{ email, delivery_channel: NO_DELIVERY, phone_number: phone || '' }],
  })
  parties.push({
    self: 1,
    consumer: 0,
    name: landlord_name || '',
    orgnr: landlord_org_no || '',
    country: 'SE',
  })

  const contractData = {
    // billing
    bankgiro: bankgiro_no,
    deposit,
    deposit_pay_date: deposit_refund_weeks,
    rent_service_increase_perc: rent_yearly_increase_rate,
    rent_service_increase_date: rent_yearly_increase_date,
    unit_rent_billing_date: rent_day_of_month,
    unit_service_billing_date: service_fee_day_of_month,
    // member
    member_1_email: email,
    member_1_fullname: full_name,
    // facade
    move_in_date: format(new Date(move_in_date), 'yyyy MMM dd', { locale: sv }),
    project_name,
    coliving_hub,
    property_unit_designation,
    // landlord
    org_name: landlord_name,
    org_email: landlord_email,
    org_number: landlord_org_no,
    org_address_street: landlord_street,
    org_address_zip: landlord_zip,
    org_address_area: landlord_post_area,
    // room
    unit_address_area: post_area,
    unit_address_street: street,
    unit_address_zip: zip,
    unit_floor: floor_no,
    unit_lgh_number: number,
    unit_rent: rent,
    unit_size: size,
    unit_shared_size: shared_area_size,
    unit_service_fee: service_fee,
    unit_type: UNIT_TYPE[people_per_room],
    unit_type_max: UNIT_TYPE_MAX[people_per_room],
    unit_type_max_descr: UNIT_TYPE_MAX_DESCR[people_per_room],
    ...extra_fields,
  }

  Object.keys(contractData).forEach(external_key => {
    data.push({
      key: 'data_field',
      value: {
        external_key,
        value: contractData[external_key] ? String(contractData[external_key]) : '',
      },
    })
  })

  if (number_of_tenants === 2) {
    const { first_name, last_name, email, phone } = items[1]
    const full_name = `${first_name} ${last_name}`
    parties.push({
      name: full_name,
      consumer: 1,
      participants: [{ email, delivery_channel: NO_DELIVERY, phone_number: phone || '' }],
    })
    data.push({
      key: 'data_field',
      value: {
        external_key: 'member_2_fullname',
        value: full_name,
      },
    }, {
      key: 'data_field',
      value: {
        external_key: 'member_2_email',
        value: email,
      },
    })
  }
  return Promise.resolve({ collection_id, source_id, parties, data })
}

export const mapParticipantWithCandidate = (candidates, parties): IParticipant[] => candidates.map(({ email, iduser, first_name, room_id, facade_id }) => {
  const { agreement, id } = find(parties, ['email', email]).participants[0]
  return { iduser, room_id, facade_id, external_id: agreement.id, external_participant_id: id, email, first_name }
})

export const parseOneflowResponse = (data: IOneflowResponse) => {
  const { events, agreement_id } = data
  let status
  let participantId
  events.forEach(event => {
    status = EVENT_CONTRACT_STATUS_MAPPING[event.type]
    // Corresponding to participant sign and participant rejection
    participantId = [4, 5].includes(event.type) && event.refs.participant_id
  })
  if (!status) {
    return Promise.reject({ message: 'NO_CONTENT', reason: 'No contract status is mapped to event type' })
  }
  return Promise.resolve({ externalId: agreement_id, status, participantId })
}

export const parseContractTemplates = (response: any): ITemplate[] => {
  const { data: { collection } } = response
  return collection
    .filter(({ visible }) => visible)
    .map(({ agreement: { id, name, template_group } }) => ({
      id, name, template_group_id: template_group.id
        ? template_group.id : Promise.reject({ message: 'NOT_ALLOWED', reason: 'No valid template group id is found' }),
    }))
}

export const parseTemplateGroup = ({ data }) => data.data_field_set.id

export const parseCollections = ({ data }) => data.map(({ id, name }) => ({ id, name }))

export const excludeSharedDataFields = dataFields => dataFields
  .filter(dataField => !CONTRACT_SHARED_EXTERNAL_KEYS.includes(dataField.external_key))
  .reduce((result, { external_key }) => {
    result[external_key] = ''
    return result
  }, {})
