import * as admin from 'firebase-admin'
import config from './../../../config/app-config'
export const firebaseBackofficeService = admin.initializeApp(
  {
    credential: admin.credential.cert(
      JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_BACKOFFICE)
    ),
    storageBucket: process.env.FB_STORAGE_BUCKET_BACKOFFICE,
  },
  config.FIREBASE_BACKOFFICE_APP
)
