"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const stream_chat_1 = require("stream-chat");
const client = new stream_chat_1.StreamChat(process.env.GETSTREAM_CHAT_KEY, process.env.GETSTREAM_CHAT_SECRET);
exports.client = client;
//# sourceMappingURL=client.js.map