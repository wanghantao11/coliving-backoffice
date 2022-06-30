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
var Scope_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
let Scope = Scope_1 = class Scope {
};
// factory method
Scope.generateUser = (scope) => {
    const _scope = new Scope_1();
    Object.keys(scope).forEach(key => {
        _scope[key] = scope[key];
    });
    return _scope;
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of scope',
        example: 10,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Scope.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Value of the scope',
        example: 10,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Scope.prototype, "value", void 0);
Scope = Scope_1 = __decorate([
    typeorm_1.Unique(['value']),
    swagger_express_ts_1.ApiModel({
        description: 'Scope entity',
        name: 'Scope',
    }),
    typeorm_1.Entity()
], Scope);
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map