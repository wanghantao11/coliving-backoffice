"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const interests_1 = require("../entity/interests");
let InterestsRepository = class InterestsRepository {
    constructor() {
        this.REPO_NAME = 'interests';
        this.getInterests = () => typeorm_1.getRepository(interests_1.Interests, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .getMany();
        this.getInterestsByIds = (ids) => typeorm_1.getRepository(interests_1.Interests, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id IN (:...ids)', { ids })
            .getMany();
    }
};
InterestsRepository = __decorate([
    inversify_1.injectable()
], InterestsRepository);
exports.InterestsRepository = InterestsRepository;
//# sourceMappingURL=interests.js.map