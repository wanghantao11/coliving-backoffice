"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_MAILCHIMP_TAGS = exports.PROJECT_MAILCHIMP_TAG_MAPPING = exports.TAG_STATUS = exports.EMAIL_MARKETING_STATUS = exports.INTEREST_MAILCHIMP_MAPPING = void 0;
exports.INTEREST_MAILCHIMP_MAPPING = {
    1: '32e466a294',
    2: 'a0f0267fcb',
    3: 'bf6a287dd1',
    4: 'fff0ffd629',
    5: '812b5ad443',
    6: '53850b762b',
    7: 'a62d59b378',
    8: '9699341435',
    9: '7dfb22a256',
    10: '0133986dc4',
    11: 'b2e753bec9',
};
var EMAIL_MARKETING_STATUS;
(function (EMAIL_MARKETING_STATUS) {
    EMAIL_MARKETING_STATUS["SUBSCRIBED"] = "subscribed";
    EMAIL_MARKETING_STATUS["UNSUBSCRIBED"] = "unsubscribed";
    EMAIL_MARKETING_STATUS["PENDING"] = "pending";
    EMAIL_MARKETING_STATUS["CLEANED"] = "cleaned";
})(EMAIL_MARKETING_STATUS = exports.EMAIL_MARKETING_STATUS || (exports.EMAIL_MARKETING_STATUS = {}));
var TAG_STATUS;
(function (TAG_STATUS) {
    TAG_STATUS["ACTIVE"] = "active";
    TAG_STATUS["INACTIVE"] = "inactive";
})(TAG_STATUS = exports.TAG_STATUS || (exports.TAG_STATUS = {}));
exports.PROJECT_MAILCHIMP_TAG_MAPPING = {
    3: { subscription: 'Lab - Subscribed', tenant: 'Lab - Tenant', contract: { generated: 'Lab - Contract Generated', signed: 'Lab - Contract Signed' } },
    4: { subscription: 'U25 - Subscribed', tenant: 'U25 - Tenant', contract: { generated: 'U25 - Contract Generated', signed: 'U25 - Contract Signed' } },
    5: { subscription: 'Parkstråket - Subscribed', tenant: 'Parkstråket - Tetant', contract: { generated: 'Parkstråket - Contract Generated', signed: 'Parkstråket - Contract Signed' } },
};
var EVENT_MAILCHIMP_TAGS;
(function (EVENT_MAILCHIMP_TAGS) {
    EVENT_MAILCHIMP_TAGS["ROOMIE_TEST_STARTED"] = "Roomie Test Started";
    EVENT_MAILCHIMP_TAGS["ROOMIE_TEST_COMPLETE"] = "Roomie Test Complete";
})(EVENT_MAILCHIMP_TAGS = exports.EVENT_MAILCHIMP_TAGS || (exports.EVENT_MAILCHIMP_TAGS = {}));
//# sourceMappingURL=mailchimp.js.map