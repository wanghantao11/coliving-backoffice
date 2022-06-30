export enum PREFERRED_ROOMMATES_STATUS {
  PENDING = 'Pending', // invitation email sent
  ACCEPTED = 'Accepted', // invitee accepted the invitation
  REJECTED = 'Rejected', // invitee rejected the invitation
}

/**
 * @see Colive-Final-Formula-Sheet in dropbox
 */
export const PERSONALITY_CATEGORY_MAPPING = {
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
}

export const MINUEND_OF_INVERTED_SCORE = 7

export enum USER_TYPE {
  LIGHT = 'Light', // default user type
  CANDIDATE = 'Candidate', // after accepting offer, user becomes candidate
  TENANT = 'Tenant', // after candidate finishes all the necessary process(to be decided)
}

export const MAX_USER_LIMIT = 32

export const PIN_CODE_SIZE = 6

export const PIN_CODE_EXPIRE_TIME = 60 * 10
