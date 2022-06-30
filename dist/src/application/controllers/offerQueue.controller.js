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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const statuscodes = require("http-status-codes");
const inversify_express_utils_1 = require("inversify-express-utils");
const offer_service_1 = require("./../services/offer.service");
let OfferQueueController = class OfferQueueController extends inversify_express_utils_1.BaseHttpController {
    constructor(offerService) {
        super();
        this.offerService = offerService;
    }
    /**
     *
     * @param req
     * ```
     * req.body.iduser
     * req.body.facade_id
     * req.body.preferences
     * ```
     */
    searchMatchedOffer(req) {
        // TODO add validation for internal use
        return this.offerService.searchMatchedOffer(req.body)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/search-offer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferQueueController.prototype, "searchMatchedOffer", null);
OfferQueueController = __decorate([
    inversify_express_utils_1.controller('/offer-queue'),
    __param(0, inversify_1.inject('OfferService')),
    __metadata("design:paramtypes", [offer_service_1.OfferService])
], OfferQueueController);
exports.default = OfferQueueController;
//# sourceMappingURL=offerQueue.controller.js.map