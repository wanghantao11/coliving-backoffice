"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv = require("dotenv");
dotenv.config();
require("reflect-metadata");
const body_parser_1 = require("body-parser");
const compression = require("compression");
const express = require("express");
const inversify_express_utils_1 = require("inversify-express-utils");
const morgan = require("morgan");
const httpContext = require("express-http-context");
const swagger = require("swagger-express-ts");
const cors_1 = require("./application/middleware/cors");
const constants_1 = require("./infrastructure/constants");
const loggers_1 = require("./infrastructure/utils/loggers");
const app_config_1 = require("../config/app-config");
const container_1 = require("./container");
const error_1 = require("./application/middleware/error");
const arena_1 = require("./infrastructure/persistence/queue/arena");
const proccessor_1 = require("./infrastructure/persistence/queue/proccessor");
const db = container_1.container.get('TypeORMConnectionService');
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.container, null, { rootPath: constants_1.API_VERSION });
server.setConfig((app) => {
    // Set swagger configs
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express({
        definition: {
            info: {
                title: 'COLIVE API Docs',
                version: '1.0',
            },
            externalDocs: {
                url: '/api-docs/swagger',
            },
        },
    }));
    app.use(cors_1.allowCrossDomain);
    app.use(body_parser_1.json({ limit: '10mb' }));
    app.use(morgan('combined', { stream: loggers_1.logger.stream }));
    app.use(compression());
    app.use(httpContext.middleware);
    app.use('/', arena_1.arenaConfig);
    if (process.env.NODE_ENV !== 'production') {
        app.use('/docs', express.static('docs'));
    }
});
server.setErrorConfig((app) => {
    app.use(error_1.handleError());
});
const app = server.build();
exports.app = app;
// Initialize queue processor
proccessor_1.queueProcessInitialization();
// Starts the app
if (process.env.NODE_ENV !== 'test') {
    loggers_1.logger.info(`Starting app at port: ${app_config_1.default.PORT}...`);
    db.startConn()
        .then(() => loggers_1.logger.info('Connected to db.'))
        .catch(reason => loggers_1.logger.error(`Error when connecting to db! ${reason}`));
    app.listen(typeof app_config_1.default.PORT === 'string' ? parseInt(app_config_1.default.PORT, 10) : app_config_1.default.PORT);
}
//# sourceMappingURL=app.js.map