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
exports.queueProcessInitialization = void 0;
const axios_1 = require("axios");
const offer_queue_1 = require("./offer.queue");
exports.queueProcessInitialization = () => offer_queue_1.OfferQueue.process('requestOffer', (job) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post(process.env.BACKOFFICE_BACKEND + '/offer-queue/search-offer', job.data);
}));
//# sourceMappingURL=proccessor.js.map