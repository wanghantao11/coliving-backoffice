import { array, boolean, date, number, object, string, validate } from 'joi'
import { Project } from '../../domain/entity'

export const isPublishable = (project: Project) => {
  const gallerySchema = object().keys({
    id: number().allow(null),
    project_id: number().allow(null),
    source: string().uri().allow(null, ''),
    text: string().allow('', null),
    created_at: date(),
    updated_at: date(),
  })

  const schema = object().keys({
    id: number().not().empty().required(),
    facade_id: number().not().empty().required(),
    client_id: number().not().empty().required(),
    about_location: string().allow('', null),
    about_location_en: string().allow('', null),
    about_project: string().allow('', null),
    about_project_en: string().allow('', null),
    about_other_info: string().allow('', null),
    about_other_info_en: string().allow('', null),
    apartments: number().allow(null),
    city: string().not().empty().required(),
    community_features: array().items(string()).allow(null, []),
    country: string().not().empty().required(),
    cover_image_source: string().uri(),
    cover_image_text: string().allow('', null),
    created_at: date(),
    distance_to_public_transport: string().allow('', null),
    floor_map_source: string().uri().allow('', null),
    floor_map_text: string().allow('', null),
    gallery: array().items(gallerySchema).allow(null, []),
    is_published: boolean().allow(null),
    key_features: array().items(string()).allow(null, []),
    move_in_date: date().allow(null),
    name: string().not().empty().required(),
    published_at: date().allow(null),
    room_features: array().items(string()).allow(null, []),
    room_rent_from: number().allow(null),
    room_rent_to: number().allow(null),
    room_size_from: number().allow(null),
    room_size_to: number().allow(null),
    roomies_from: number().allow(null),
    roomies_to: number().allow(null),
    service_fee: number().allow(null),
    shared_area_size_from: number().allow(null),
    shared_area_size_to: number().allow(null),
    status: string().allow('', null),
    street: string().not().empty().required(),
    third_party_services: array().items(string()).allow(null, []),
    updated_at: date(),
    zip: string().not().empty().required(),
  })

  return validate(project, schema, (err, value) =>
    err ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Project is not publishable' })
      : Promise.resolve({ value })
  )
}
