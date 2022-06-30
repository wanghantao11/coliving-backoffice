"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIN_CODE_EXPIRE_TIME = exports.PIN_CODE_SIZE = exports.MAX_USER_LIMIT = exports.USER_TYPE = exports.MINUEND_OF_INVERTED_SCORE = exports.PERSONALITY_CATEGORY_MAPPING = exports.PREFERRED_ROOMMATES_STATUS = void 0;
var PREFERRED_ROOMMATES_STATUS;
(function (PREFERRED_ROOMMATES_STATUS) {
    PREFERRED_ROOMMATES_STATUS["PENDING"] = "Pending";
    PREFERRED_ROOMMATES_STATUS["ACCEPTED"] = "Accepted";
    PREFERRED_ROOMMATES_STATUS["REJECTED"] = "Rejected";
})(PREFERRED_ROOMMATES_STATUS = exports.PREFERRED_ROOMMATES_STATUS || (exports.PREFERRED_ROOMMATES_STATUS = {}));
/**
 * @see Colive-Final-Formula-Sheet in dropbox
 */
exports.PERSONALITY_CATEGORY_MAPPING = {
    agreeableness: { weight: 0.25, count_of_questions: 12 },
    conscientiousness: { weight: 0.3, count_of_questions: 12 },
    emotional_stability: { weight: 0.1, count_of_questions: 12 },
    extroversion: { weight: 0.25, count_of_questions: 12 },
    openness: { weight: 0.1, count_of_questions: 12 },
    activity: { weight: 0.125, count_of_questions: 8 },
    conformity: { weight: 0.125, count_of_questions: 8 },
    engagement: { weight: 0.2, count_of_questions: 8 },
    hedonism: { weight: 0.125, count_of_questions: 8 },
    humanism: { weight: 0.125, count_of_questions: 8 },
    performance: { weight: 0.05, count_of_questions: 8 },
    power: { weight: 0.05, count_of_questions: 8 },
    safety: { weight: 0.1, count_of_questions: 8 },
    tradition: { weight: 0.1, count_of_questions: 8 },
};
exports.MINUEND_OF_INVERTED_SCORE = 7;
var USER_TYPE;
(function (USER_TYPE) {
    USER_TYPE["LIGHT"] = "Light";
    USER_TYPE["CANDIDATE"] = "Candidate";
    USER_TYPE["TENANT"] = "Tenant";
})(USER_TYPE = exports.USER_TYPE || (exports.USER_TYPE = {}));
exports.MAX_USER_LIMIT = 32;
exports.PIN_CODE_SIZE = 6;
exports.PIN_CODE_EXPIRE_TIME = 60 * 10;
//# sourceMappingURL=user.js.map