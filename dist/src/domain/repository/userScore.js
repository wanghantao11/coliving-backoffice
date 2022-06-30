"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScoreRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
let UserScoreRepository = class UserScoreRepository {
    constructor() {
        this.REPO_NAME = 'user_score';
        this.createUserScore = (userScore) => typeorm_1.getRepository(entity_1.UserScore, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.UserScore)
            .values(Object.assign({}, userScore))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getUserScoreByExternalId = (iduser) => typeorm_1.getRepository(entity_1.UserScore, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = iduser', { iduser })
            .getOne();
        this.getUserScoresByExternalIds = (idusers) => typeorm_1.getRepository(entity_1.UserScore, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser IN (:...idusers)', { idusers })
            .getMany();
    }
};
UserScoreRepository = __decorate([
    inversify_1.injectable()
], UserScoreRepository);
exports.UserScoreRepository = UserScoreRepository;
//# sourceMappingURL=userScore.js.map