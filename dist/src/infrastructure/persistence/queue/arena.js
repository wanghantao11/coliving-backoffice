"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arenaConfig = void 0;
const Arena = require("bull-arena");
const app_config_1 = require("../../../../config/app-config");
exports.arenaConfig = Arena({
    queues: [
        {
            // Name of the bull queue, this name must match up exactly with what you've defined in bull.
            name: 'offer',
            // Hostname or queue prefix, you can put whatever you want.
            hostId: 'colive',
            url: app_config_1.default.REDIS_URL,
        },
    ],
}, {
    port: 8080,
    // Make the arena dashboard become available at {my-site.com}/arena.
    basePath: '/arena',
    // Let express handle the listening.
    disableListen: true,
});
//# sourceMappingURL=arena.js.map