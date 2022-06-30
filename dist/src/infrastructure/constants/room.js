"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFFER_STATUS = exports.ROOM_STATUS = exports.PERIOD_OF_STAY = void 0;
var PERIOD_OF_STAY;
(function (PERIOD_OF_STAY) {
    PERIOD_OF_STAY["THREE_TO_SIX_MONTHS"] = "THREE_TO_SIX_MONTHS";
    PERIOD_OF_STAY["SIX_MONTHS_TO_ONE_YEAR"] = "SIX_MONTHS_TO_ONE_YEAR";
    PERIOD_OF_STAY["ONE_TO_THREE_YEARS"] = "ONE_TO_THREE_YEARS";
    PERIOD_OF_STAY["MORE_THAN_THREE_YEARS"] = "MORE_THAN_THREE_YEARS";
    PERIOD_OF_STAY["NOT_SPECIFIED"] = "NOT_SPECIFIED";
})(PERIOD_OF_STAY = exports.PERIOD_OF_STAY || (exports.PERIOD_OF_STAY = {}));
var ROOM_STATUS;
(function (ROOM_STATUS) {
    ROOM_STATUS["AVAILABLE"] = "Available";
    ROOM_STATUS["RESERVED"] = "Reserved";
    ROOM_STATUS["OCCUPIED"] = "Occupied";
    ROOM_STATUS["OUT_OF_SERVICE"] = "Out of service";
})(ROOM_STATUS = exports.ROOM_STATUS || (exports.ROOM_STATUS = {}));
var OFFER_STATUS;
(function (OFFER_STATUS) {
    OFFER_STATUS["PENDING"] = "Pending";
    OFFER_STATUS["ACCEPTED"] = "Accepted";
    OFFER_STATUS["REJECTED"] = "Rejected";
})(OFFER_STATUS = exports.OFFER_STATUS || (exports.OFFER_STATUS = {}));
//# sourceMappingURL=room.js.map