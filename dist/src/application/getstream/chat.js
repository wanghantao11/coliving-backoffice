"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberToProjectChannel = exports.addMemberToApartmentChannel = exports.createChatToken = void 0;
const client_1 = require("./client");
const getstream_1 = require("./../../infrastructure/constants/getstream");
const loggers_1 = require("./../../infrastructure/utils/loggers");
exports.createChatToken = (iduser) => Promise.resolve(client_1.client.createToken(iduser));
exports.addMemberToApartmentChannel = (id, apartmentId) => {
    const channelId = `apartment-${apartmentId}`;
    const query = { cid: `${getstream_1.CHANNEL_TYPE}:${channelId}` };
    return client_1.client.queryChannels(query)
        .then(channels => channels.length > 0 ?
        Promise.all(channels.map(channel => channel.addMembers([id]))).then(() => ({ channelId }))
        :
            // Channel not exist, create a new one with the member
            Promise.resolve(client_1.client.channel(getstream_1.CHANNEL_TYPE, channelId, {
                name: 'Min lägenhet',
                members: [id],
                created_by: { id: 'colive-admin', name: 'Colive Administrator' },
            }).create()).then(() => ({ channelId }))).catch(error => 
    // Mute the error if failed to add the member to apartment channel
    loggers_1.errorEventLogger.error({ data: error.message }));
};
exports.addMemberToProjectChannel = (id, facadeId, projectName, image, host) => {
    const channelId = `project-${facadeId}`;
    const query = { cid: `${getstream_1.CHANNEL_TYPE}:${channelId}` };
    return client_1.client.queryChannels(query)
        .then(channels => channels.length > 0 ?
        Promise.all(channels.map(channel => channel.addMembers([id]))).then(() => ({ channelId }))
        :
            // Channel not exist, create a new one with the host and the member
            Promise.resolve(client_1.client.channel(getstream_1.CHANNEL_TYPE, channelId, {
                name: `Mitt community - ${projectName}`,
                image,
                members: [`host-${host.id}`, id],
                created_by: { id: `host-${host.id}`, name: `${host.first_name} ${host.last_name}` },
            }).create()).then(() => ({ channelId }))).catch(error => {
        // Mute the error if failed to add the member to project channel
        loggers_1.errorEventLogger.error({ data: error.message });
    });
};
//# sourceMappingURL=chat.js.map