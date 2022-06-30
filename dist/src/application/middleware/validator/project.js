"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProjectValidator = exports.UploadProjectImageValidator = exports.GetPublishedProjectsValidator = exports.PublishedProjectValidator = exports.GetProjectByFacadeIdValidator = exports.UpdateProjectValidator = exports.CreateProjectValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
const contract_1 = require("../../../infrastructure/utils/contract");
const constants_1 = require("../../../infrastructure/constants");
let CreateProjectValidator = class CreateProjectValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const gallerySchema = joi_1.object().keys({
            id: joi_1.number().allow(null),
            project_id: joi_1.number().allow(null),
            source: joi_1.string().uri().allow(null, ''),
            text: joi_1.string().allow('', null),
            created_at: joi_1.date().optional(),
            updated_at: joi_1.date().optional(),
        });
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().not().empty().required(),
            about_location: joi_1.string().allow('', null),
            about_location_en: joi_1.string().allow('', null),
            about_project: joi_1.string().allow('', null),
            about_project_en: joi_1.string().allow('', null),
            about_other_info: joi_1.string().allow('', null),
            about_other_info_en: joi_1.string().allow('', null),
            apartments: joi_1.number().allow(null),
            city: joi_1.string().allow('', null),
            community_features: joi_1.array().items(joi_1.string()).allow(null, []),
            country: joi_1.string().allow('', null),
            cover_image_source: joi_1.string().uri().allow('', null),
            cover_image_text: joi_1.string().allow('', null),
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
            status: joi_1.string().allow(null, ''),
            street: joi_1.string().allow('', null),
            third_party_services: joi_1.array().items(joi_1.string()).allow(null, []),
            zip: joi_1.string().allow('', null),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateProjectValidator = __decorate([
    inversify_1.injectable()
], CreateProjectValidator);
exports.CreateProjectValidator = CreateProjectValidator;
let UpdateProjectValidator = class UpdateProjectValidator extends inversify_express_utils_1.BaseMiddleware {
    constructor(projectDao) {
        super();
        this.projectDao = projectDao;
    }
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const gallerySchema = joi_1.object().keys({
            id: joi_1.number().allow(null),
            project_id: joi_1.number().allow(null),
            source: joi_1.string().uri().allow(null, ''),
            text: joi_1.string().allow('', null),
            created_at: joi_1.date().optional(),
            updated_at: joi_1.date().optional(),
        });
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                about_location: joi_1.string().allow(null, ''),
                about_location_en: joi_1.string().allow(null, ''),
                about_project: joi_1.string().allow(null, ''),
                about_project_en: joi_1.string().allow(null, ''),
                about_other_info: joi_1.string().allow(null, ''),
                about_other_info_en: joi_1.string().allow(null, ''),
                apartments: joi_1.number().allow(null),
                city: joi_1.string().optional(),
                community_features: joi_1.array().items(joi_1.string()).allow(null, []),
                country: joi_1.string().optional(),
                cover_image_source: joi_1.string().uri().optional(),
                cover_image_text: joi_1.string().allow(null, ''),
                distance_to_public_transport: joi_1.string().allow(null, ''),
                floor_map_source: joi_1.string().uri().allow(null, ''),
                floor_map_text: joi_1.string().allow(null, ''),
                gallery: joi_1.array().items(gallerySchema).allow(null, []),
                is_published: joi_1.boolean().optional(),
                key_features: joi_1.array().items(joi_1.string()).allow(null, []),
                move_in_date: joi_1.date().allow(null),
                name: joi_1.string().optional(),
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
                status: joi_1.string().allow(null, ''),
                street: joi_1.string().optional(),
                third_party_services: joi_1.array().items(joi_1.string()).allow(null, []),
                zip: joi_1.string().optional(),
            }),
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
        });
        if (data.body.status && data.body.status === constants_1.PROJECT_STATUS.AVAILABLE) {
            return this.projectDao.getProjectDataForContractByProjectId(Number(data.params.id))
                .then(contractData => !contractData || contractData.rooms.length === 0 ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data not found for project ${data.params.id}` }) : contractData)
                .then((_a) => {
                var { rooms } = _a, rest = __rest(_a, ["rooms"]);
                return contract_1.checkIsContractDataReadyForProject(rooms.map(room => (Object.assign(Object.assign({}, room), rest))));
            })
                .then(isContractDataReady => !isContractDataReady ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data is not ready for project ${data.params.id}` }) : null)
                .then(() => joi_1.validate(data, schema, err => err
                ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' })
                : next()))
                .catch(next);
        }
        else {
            joi_1.validate(data, schema, err => err
                ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
                : next());
        }
    }
};
UpdateProjectValidator = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectDao')),
    __metadata("design:paramtypes", [Object])
], UpdateProjectValidator);
exports.UpdateProjectValidator = UpdateProjectValidator;
let GetProjectByFacadeIdValidator = class GetProjectByFacadeIdValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
            : next());
    }
};
GetProjectByFacadeIdValidator = __decorate([
    inversify_1.injectable()
], GetProjectByFacadeIdValidator);
exports.GetProjectByFacadeIdValidator = GetProjectByFacadeIdValidator;
let PublishedProjectValidator = class PublishedProjectValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
            : next());
    }
};
PublishedProjectValidator = __decorate([
    inversify_1.injectable()
], PublishedProjectValidator);
exports.PublishedProjectValidator = PublishedProjectValidator;
let GetPublishedProjectsValidator = class GetPublishedProjectsValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            offset: joi_1.number().default(0),
            limit: joi_1.number().default(10),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
            : next());
    }
};
GetPublishedProjectsValidator = __decorate([
    inversify_1.injectable()
], GetPublishedProjectsValidator);
exports.GetPublishedProjectsValidator = GetPublishedProjectsValidator;
let UploadProjectImageValidator = class UploadProjectImageValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { params: req.params, body: req.body };
        const schema = joi_1.object().keys({
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
            body: joi_1.object().keys({
                img: joi_1.string().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
            : next());
    }
};
UploadProjectImageValidator = __decorate([
    inversify_1.injectable()
], UploadProjectImageValidator);
exports.UploadProjectImageValidator = UploadProjectImageValidator;
let DeleteProjectValidator = class DeleteProjectValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
            : next());
    }
};
DeleteProjectValidator = __decorate([
    inversify_1.injectable()
], DeleteProjectValidator);
exports.DeleteProjectValidator = DeleteProjectValidator;
//# sourceMappingURL=project.js.map