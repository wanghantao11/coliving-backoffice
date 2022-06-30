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
var UserScore_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScore = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let UserScore = UserScore_1 = class UserScore {
};
// factory method
UserScore.generateUserScore = (userScore) => {
    const _userScore = new UserScore_1();
    Object.keys(userScore).forEach(key => {
        _userScore[key] = userScore[key];
    });
    return Promise.resolve(_userScore);
};
__decorate([
    typeorm_1.OneToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], UserScore.prototype, "user", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], UserScore.prototype, "iduser", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserScore.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "agreeableness", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "conscientiousness", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "emotional_stability", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "extroversion", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "openness", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "activity", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "conformity", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], UserScore.prototype, "engagement", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "hedonism", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "humanism", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "performance", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "power", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "safety", void 0);
__decorate([
    typeorm_1.Column('numeric', { precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], UserScore.prototype, "tradition", void 0);
UserScore = UserScore_1 = __decorate([
    typeorm_1.Unique(['iduser']),
    typeorm_1.Entity()
], UserScore);
exports.UserScore = UserScore;
//# sourceMappingURL=userScore.js.map