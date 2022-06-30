export const API_VERSION = '/v1'

export const FB_STORAGE_URL_PREFIX = 'https://firebasestorage.googleapis.com/v0/b/'

export const DEFAULT_PROFILE_IMAGE = `${FB_STORAGE_URL_PREFIX}${process.env.FB_STORAGE_BUCKET}/o/images%2FDefaultProfileImage.png?alt=media&token=4454115e-1a34-401b-91d5-80d477e85e4b`

export const SALT_ROUNDS = 10

export const MILLISECONDS_IN_A_YEAR = 31556952000

export const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
