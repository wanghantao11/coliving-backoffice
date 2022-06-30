"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const dist_1 = require("typeorm-fixtures-cli/dist");
const typeorm_1 = require("typeorm");
const loggers_1 = require("../src/infrastructure/utils/loggers");
const loadFixtures = (fixturesPath) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        const options = yield typeorm_1.getConnectionOptions(process.env.NODE_ENV);
        connection = yield typeorm_1.createConnection(Object.assign(Object.assign({}, options), { migrationsRun: false }));
        yield connection.synchronize(true);
        yield connection.query('delete from "user";');
        yield connection.query('delete from client;');
        yield connection.query('delete from admin;');
        yield connection.query('delete from member_tags;');
        yield connection.query('delete from label;');
        yield connection.query('delete from admin_member_notes;');
        yield connection.query('delete from project_facade;');
        yield connection.query('delete from address;');
        yield connection.query('delete from apartment;');
        yield connection.query('delete from application;');
        yield connection.query('delete from contract;');
        yield connection.query('delete from contract_templates;');
        yield connection.query('delete from emergency_contacts;');
        yield connection.query('delete from incident_report;');
        yield connection.query('delete from interests;');
        yield connection.query('delete from offer;');
        yield connection.query('delete from project;');
        yield connection.query('delete from project_gallery;');
        yield connection.query('delete from role;');
        yield connection.query('delete from room;');
        yield connection.query('delete from scope;');
        const loader = new dist_1.Loader();
        loader.load(path.resolve(fixturesPath));
        const resolver = new dist_1.Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new dist_1.Builder(connection, new dist_1.Parser());
        for (const fixture of dist_1.fixturesIterator(fixtures)) {
            const entity = yield builder.build(fixture);
            yield typeorm_1.getRepository(entity.constructor.name, process.env.NODE_ENV).save(entity);
        }
    }
    finally {
        if (connection) {
            yield connection.close();
        }
    }
});
loadFixtures('./fixtures')
    .then(() => {
    loggers_1.logger.info({ message: 'Fixtures are successfully loaded.' });
    process.exit();
})
    .catch(err => loggers_1.logger.info(err));
//# sourceMappingURL=index.js.map