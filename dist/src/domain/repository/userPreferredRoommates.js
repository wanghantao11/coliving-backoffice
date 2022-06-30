"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferredRoommatesRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../entity");
let UserPreferredRoommatesRepository = class UserPreferredRoommatesRepository {
    constructor() {
        this.REPO_NAME = 'user_preferred_roommates';
        this.createUserPreferredRoommate = (data) => typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.UserPreferredRoommates)
            .values(Object.assign({}, data))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.updateUserPreferredRoommate = (data) => typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign(Object.assign({}, data), { invitation_code: null }))
            .where('inviter_id = :inviter_id AND invitee_id = :invitee_id', { inviter_id: data.inviter_id, invitee_id: data.invitee_id })
            .execute()
            .then(res => res.raw[0]);
        this.deleteUserPreferredRoommate = (id) => typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .from(entity_1.UserPreferredRoommates)
            .where('id = :id', { id })
            .execute();
        this.deleteUserPreferredRoommateBy = (filter) => {
            const queries = [];
            const { iduser } = filter;
            if (iduser) {
                queries.push(`(user_preferred_roommates.inviter_id = '${iduser}' OR user_preferred_roommates.invitee_id = '${iduser}')`);
            }
            return typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .delete()
                .from(entity_1.UserPreferredRoommates)
                .where(queries.join(' AND '))
                .execute();
        };
        this.getUserPreferredRoommates = (iduser) => typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .leftJoin(entity_1.User, 'invitee', 'invitee.iduser = user_preferred_roommates.invitee_id')
            .leftJoin(entity_1.User, 'inviter', 'inviter.iduser = user_preferred_roommates.inviter_id')
            .select([
            'id',
            'status',
            'created_at',
            'updated_at',
            'invitee.iduser',
            'invitee.first_name',
            'invitee.last_name',
            'invitee.img_url',
            'inviter.iduser',
            'inviter.first_name',
            'inviter.last_name',
            'inviter.img_url',
        ])
            .where('user_preferred_roommates.inviter_id = :iduser OR user_preferred_roommates.invitee_id = :iduser', { iduser })
            .getRawMany();
        this.getPairedPreferredRoommate = (iduser) => typeorm_1.getRepository(entity_1.UserPreferredRoommates, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('status = \'Accepted\' AND (inviter_id = :iduser OR invitee_id = :iduser)', { iduser })
            .getOne();
    }
};
UserPreferredRoommatesRepository = __decorate([
    inversify_1.injectable()
], UserPreferredRoommatesRepository);
exports.UserPreferredRoommatesRepository = UserPreferredRoommatesRepository;
//# sourceMappingURL=userPreferredRoommates.js.map