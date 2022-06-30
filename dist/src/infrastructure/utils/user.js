"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserCandidateOrTenant = exports.isCandidate = exports.otherUserMapping = exports.convertToDateStringToISOString = exports.convertFromDateStringToISOString = exports.convertAgeToBirthday = exports.checkForMissingLocation = void 0;
const common_1 = require("./../constants/common");
const common_2 = require("./common");
const constants_1 = require("../constants");
// This file contains all user util functions
exports.checkForMissingLocation = locationArr => {
    if (locationArr) {
        let exist03 = false;
        let exist03All = false;
        let exist09 = false;
        let exist09All = false;
        let exist12 = false;
        let exist12All = false;
        for (const location of locationArr) {
            if (location.substring(0, 2) === '12' && !exist12All) {
                if (location === '12000') {
                    exist12All = true;
                }
                else {
                    exist12 = true;
                }
            }
            else if (location.substring(0, 2) === '09' && !exist09All) {
                if (location === '09000') {
                    exist09All = true;
                }
                else {
                    exist09 = true;
                }
            }
            else if (location.substring(0, 2) === '03' && !exist03All) {
                if (location === '03000') {
                    exist03All = true;
                }
                else {
                    exist03 = true;
                }
            }
        }
        if (exist03 && !exist03All) {
            locationArr.push('03000');
        }
        if (exist09 && !exist09All) {
            locationArr.push('09000');
        }
        if (exist12 && !exist12All) {
            locationArr.push('12000');
        }
    }
    return locationArr;
};
exports.convertAgeToBirthday = (age) => {
    const ageInMs = Math.ceil(age * common_1.MILLISECONDS_IN_A_YEAR);
    return new Date(new Date().getTime() - ageInMs);
};
exports.convertFromDateStringToISOString = (fromDate) => {
    if (!fromDate) {
        // TODO set to an old date if fromDate is not given for now
        return new Date('2018-01-01').toISOString();
    }
    return common_2.convertDateToISOString(new Date(fromDate));
};
exports.convertToDateStringToISOString = (toDate) => {
    if (!toDate) {
        // TODO set to tomorrow if toDate is not given for now
        return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
    return common_2.convertDateToISOString(new Date(toDate));
};
exports.otherUserMapping = userArr => {
    const data = [];
    if (userArr === undefined || userArr.length === 0) {
        return data;
    }
    for (let i = 0; i < userArr.length; i += 1) {
        data[i] = {};
        data[i].id = userArr[i].user_key;
        data[i].first_name = userArr[i].first_name;
        data[i].last_name = userArr[i].last_name;
        data[i].birthday = userArr[i].birthday;
        data[i].img_url = userArr[i].img_url;
        data[i].description = userArr[i].description;
    }
    return data;
};
exports.isCandidate = ({ user_type }) => user_type === constants_1.USER_TYPE.CANDIDATE;
exports.isUserCandidateOrTenant = ({ user_type }) => [String(constants_1.USER_TYPE.CANDIDATE), String(constants_1.USER_TYPE.TENANT)].includes(user_type);
//# sourceMappingURL=user.js.map