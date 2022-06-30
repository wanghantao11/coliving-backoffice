import * as admin from 'firebase-admin'
import config from './../../../config/app-config'

const firebaseCommunityService = admin.initializeApp(
  {
    credential: admin.credential.cert(
      JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_COMMUNITY)
    ),
    storageBucket: process.env.FB_STORAGE_BUCKET,
  },
  config.FIREBASE_COMMUNITY_APP
)

export { firebaseCommunityService }
