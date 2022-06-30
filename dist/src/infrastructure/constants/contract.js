"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIT_TYPE_MAX = exports.UNIT_TYPE_MAX_DESCR = exports.UNIT_TYPE = exports.EVENT_CONTRACT_STATUS_MAPPING = exports.SIGN_KEY = exports.NO_DELIVERY = exports.SWEDISH_BANKID_SIGN_METHOD_ID = exports.CONTRACT_SHARED_EXTERNAL_KEYS = exports.CONTRACT_DOCUMENT_TYPE = exports.CONTRACT_STATUS = void 0;
var CONTRACT_STATUS;
(function (CONTRACT_STATUS) {
    CONTRACT_STATUS["PENDING"] = "Pending";
    CONTRACT_STATUS["SIGNED"] = "Signed";
    CONTRACT_STATUS["ACTIVE"] = "Active";
    CONTRACT_STATUS["REJECTED"] = "Rejected";
    CONTRACT_STATUS["TERMINATED"] = "Terminated";
    CONTRACT_STATUS["EXPIRED"] = "Expired";
})(CONTRACT_STATUS = exports.CONTRACT_STATUS || (exports.CONTRACT_STATUS = {}));
var CONTRACT_DOCUMENT_TYPE;
(function (CONTRACT_DOCUMENT_TYPE) {
    CONTRACT_DOCUMENT_TYPE["EMPLOYMENT_CERTIFICATE"] = "employment_certificate";
    CONTRACT_DOCUMENT_TYPE["REFERENCE"] = "reference";
    CONTRACT_DOCUMENT_TYPE["HOME_INSURANCE"] = "home_insurance";
    CONTRACT_DOCUMENT_TYPE["ICE"] = "ice";
    CONTRACT_DOCUMENT_TYPE["IDENTITY"] = "identity";
    CONTRACT_DOCUMENT_TYPE["BANK_STATEMENT"] = "bank_statement";
})(CONTRACT_DOCUMENT_TYPE = exports.CONTRACT_DOCUMENT_TYPE || (exports.CONTRACT_DOCUMENT_TYPE = {}));
/**
 * The list should includes all the external_keys of data field that will be used in every project
 *
 * @see https://paper.dropbox.com/doc/Data-fields-in-OneFlow--A1PV~Ed_yk_UdKSILEizuK9DAg-1nU6Q0dTJCodeXbewDK0h
 */
exports.CONTRACT_SHARED_EXTERNAL_KEYS = [
    'bankgiro',
    'coliving_hub',
    'deposit',
    'deposit_pay_date',
    'member_1_fullname',
    'member_1_pers_number',
    'member_1_address_street',
    'member_1_address_zip',
    'member_1_address_area',
    'member_1_email',
    'member_2_fullname',
    'member_2_pers_number',
    'member_2_address_street',
    'member_2_address_zip',
    'member_2_address_area',
    'member_2_email',
    'move_in_date',
    'org_name',
    'org_number',
    'org_address_street',
    'org_address_zip',
    'org_address_area',
    'org_email',
    'project_name',
    'property_unit_designation',
    'rent_service_increase_date',
    'rent_service_increase_perc',
    'unit_address_area',
    'unit_address_street',
    'unit_address_zip',
    'unit_floor',
    'unit_lgh_number',
    'unit_rent',
    'unit_rent_billing_date',
    'unit_service_fee',
    'unit_service_billing_date',
    'unit_shared_size',
    'unit_size',
    'unit_type',
    'unit_type_max',
    'unit_type_max_descr',
];
exports.SWEDISH_BANKID_SIGN_METHOD_ID = 2;
exports.NO_DELIVERY = 4;
exports.SIGN_KEY = process.env.CONTRACT_SERVICE_SIGN_KEY;
/**
 * @see https://app.oneflow.com/api/docs/webhooks/agreement_event.html#agreement-events
 */
exports.EVENT_CONTRACT_STATUS_MAPPING = {
    2: CONTRACT_STATUS.SIGNED,
    4: CONTRACT_STATUS.SIGNED,
    5: CONTRACT_STATUS.REJECTED,
    17: CONTRACT_STATUS.REJECTED,
    21: CONTRACT_STATUS.TERMINATED,
    14: CONTRACT_STATUS.EXPIRED,
    22: CONTRACT_STATUS.EXPIRED,
    26: CONTRACT_STATUS.PENDING,
    39: CONTRACT_STATUS.PENDING,
};
exports.UNIT_TYPE = { 1: 'Standardrum (1 pers)', 2: 'Dubbelrum (2 pers)' };
exports.UNIT_TYPE_MAX_DESCR = { 1: 'standardrum för högst en (1) person', 2: 'dubbelrum för högst två (2) personer' };
exports.UNIT_TYPE_MAX = { 1: 'en (1) person', 2: 'två (2) personer' };
//# sourceMappingURL=contract.js.map