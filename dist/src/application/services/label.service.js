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
exports.LabelService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
let LabelService = class LabelService {
    constructor(labelDao) {
        this.labelDao = labelDao;
        this.createLabel = (label) => this.labelDao.createLabel(label);
        this.deleteLabel = (id) => this.labelDao.deleteLabel(Number(id));
        this.getLabelsByFacadeId = (id) => this.labelDao.getLabelsByFacadeId(Number(id));
        this.updateLabel = (id, data) => this.labelDao.updateLabel(Number(id), data);
    }
};
LabelService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('LabelDao')),
    __metadata("design:paramtypes", [Object])
], LabelService);
exports.LabelService = LabelService;
//# sourceMappingURL=label.service.js.map