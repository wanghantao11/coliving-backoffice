"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const admin_1 = require("./../../domain/entity/admin");
let AdminRepository = class AdminRepository {
    constructor() {
        this.REPO_NAME = 'admin';
        this.createAdmin = (admin) => typeorm_1.getRepository(admin_1.Admin, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(admin_1.Admin)
            .values(Object.assign({}, admin))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteAdmin = (id) => typeorm_1.getRepository(admin_1.Admin, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('"id" = :id ', { id })
            .delete()
            .execute();
        this.getAdminBy = (filter) => {
            const { email, id } = filter;
            const queries = [];
            if (email) {
                queries.push(`admin.email = '${email}'`);
            }
            if (id) {
                queries.push(`admin.id = '${id}'`);
            }
            return typeorm_1.getRepository(admin_1.Admin, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .leftJoinAndMapOne('admin.role', 'admin.role_id', 'role')
                .leftJoinAndMapOne('admin.client', 'admin.client_id', 'client')
                .select([
                'admin.id',
                'admin.created_at',
                'admin.updated_at',
                'admin.first_name',
                'admin.last_name',
                'admin.language',
                'admin.email',
                'admin.img_url',
                'admin.type',
                'admin.verified',
                'admin.password',
                'admin.facade_ids',
                'admin.verification_code',
            ])
                .addSelect('client.id')
                .addSelect(['role.id', 'role.name'])
                .where(queries.join(' AND '))
                .getOne();
        };
        this.getAdminsBy = (filter = {}) => {
            const { clientId, roles = [], facadeIds = [], verified } = filter;
            const queries = [];
            if (clientId) {
                queries.push(`admin.client_id = '${clientId}'`);
            }
            if (roles.length !== 0) {
                queries.push(`role.name = ANY('{${roles.join(',')}}')`);
            }
            if (facadeIds.length !== 0) {
                queries.push(`(admin.facade_ids && '{${facadeIds.join(',')}}' OR admin.facade_ids IS NULL)`);
            }
            if (verified) {
                queries.push(`admin.verified = ${verified}`);
            }
            return typeorm_1.getRepository(admin_1.Admin, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .leftJoinAndMapOne('admin.role', 'admin.role_id', 'role')
                .select([
                'admin.id',
                'admin.created_at',
                'admin.updated_at',
                'admin.first_name',
                'admin.last_name',
                'admin.language',
                'admin.email',
                'admin.img_url',
                'admin.type',
                'admin.verified',
            ])
                .addSelect(['role.id', 'role.name'])
                .where(queries.join(' AND '))
                .orderBy({ 'admin.created_at': 'ASC' })
                .getMany();
        };
        this.updateAdminBy = (filter, data) => {
            const { id, email } = filter;
            const queries = [];
            if (id) {
                queries.push(`admin.id = '${id}'`);
            }
            if (email) {
                queries.push(`admin.email = '${email}'`);
            }
            return typeorm_1.getRepository(admin_1.Admin, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .update()
                .set(Object.assign({}, data))
                .where(queries.join(' AND '))
                .execute()
                .then(res => res.raw[0]);
        };
    }
};
AdminRepository = __decorate([
    inversify_1.injectable()
], AdminRepository);
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=admin.js.map