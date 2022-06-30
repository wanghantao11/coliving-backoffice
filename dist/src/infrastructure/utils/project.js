"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublishable = void 0;
const joi_1 = require("joi");
exports.isPublishable = (project) => {
    const gallerySchema = joi_1.object().keys({
        id: joi_1.number().allow(null),
        project_id: joi_1.number().allow(null),
        source: joi_1.string().uri().allow(null, ''),
        text: joi_1.string().allow('', null),
        created_at: joi_1.date(),
        updated_at: joi_1.date(),
    });
    const schema = joi_1.object().keys({
        id: joi_1.number().not().empty().required(),
        facade_id: joi_1.number().not().empty().required(),
        client_id: joi_1.number().not().empty().required(),
        about_location: joi_1.string().allow('', null),
        about_location_en: joi_1.string().allow('', null),
        about_project: joi_1.string().allow('', null),
        about_project_en: joi_1.string().allow('', null),
        about_other_info: joi_1.string().allow('', null),
        about_other_info_en: joi_1.string().allow('', null),
        apartments: joi_1.number().allow(null),
        city: joi_1.string().not().empty().required(),
        community_features: joi_1.array().items(joi_1.string()).allow(null, []),
        country: joi_1.string().not().empty().required(),
        cover_image_source: joi_1.string().uri(),
        cover_image_text: joi_1.string().allow('', null),
        created_at: joi_1.date(),
        distance_to_public_transport: joi_1.string().allow('', null),
        floor_map_source: joi_1.string().uri().allow('', null),
        floor_map_text: joi_1.string().allow('', null),
        gallery: joi_1.array().items(gallerySchema).allow(null, []),
        is_published: joi_1.boolean().allow(null),
        key_features: joi_1.array().items(joi_1.string()).allow(null, []),
        move_in_date: joi_1.date().allow(null),
        name: joi_1.string().not().empty().required(),
        published_at: joi_1.date().allow(null),
        room_features: joi_1.array().items(joi_1.string()).allow(null, []),
        room_rent_from: joi_1.number().allow(null),
        room_rent_to: joi_1.number().allow(null),
        room_size_from: joi_1.number().allow(null),
        room_size_to: joi_1.number().allow(null),
        roomies_from: joi_1.number().allow(null),
        roomies_to: joi_1.number().allow(null),
        service_fee: joi_1.number().allow(null),
        shared_area_size_from: joi_1.number().allow(null),
        shared_area_size_to: joi_1.number().allow(null),
        status: joi_1.string().allow('', null),
        street: joi_1.string().not().empty().required(),
        third_party_services: joi_1.array().items(joi_1.string()).allow(null, []),
        updated_at: joi_1.date(),
        zip: joi_1.string().not().empty().required(),
    });
    return joi_1.validate(project, schema, (err, value) => err ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Project is not publishable' })
        : Promise.resolve({ value }));
};
//# sourceMappingURL=project.js.map