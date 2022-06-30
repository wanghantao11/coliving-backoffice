export const INTEREST_MAILCHIMP_MAPPING = {
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
}

export enum EMAIL_MARKETING_STATUS {
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
  PENDING = 'pending',
  CLEANED = 'cleaned',
}

export enum TAG_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const PROJECT_MAILCHIMP_TAG_MAPPING = {
  3: { subscription: 'Lab - Subscribed', tenant: 'Lab - Tenant', contract: { generated: 'Lab - Contract Generated', signed: 'Lab - Contract Signed'} },
  4: { subscription: 'U25 - Subscribed', tenant: 'U25 - Tenant', contract: { generated: 'U25 - Contract Generated', signed: 'U25 - Contract Signed'} },
  5: { subscription: 'Parkstråket - Subscribed', tenant: 'Parkstråket - Tetant', contract: { generated: 'Parkstråket - Contract Generated', signed: 'Parkstråket - Contract Signed'} },
}

export enum EVENT_MAILCHIMP_TAGS {
  ROOMIE_TEST_STARTED = 'Roomie Test Started',
  ROOMIE_TEST_COMPLETE = 'Roomie Test Complete',
}
