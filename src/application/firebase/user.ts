import * as firebase from 'firebase'
import * as sharp from 'sharp'
import * as uuid from 'uuid/v4'

import { firebaseCommunityService } from './community'
import { FB_STORAGE_URL_PREFIX } from './../../infrastructure/constants'

const firebaseUserService = firebase.initializeApp(
  JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_USER))

const FB_BUCKET_NAME = process.env.FB_STORAGE_BUCKET

export const signInWithEmailAndPassword = (email: string, password: string) =>
  firebaseUserService
    .auth()
    .signInWithEmailAndPassword(email, password)

export const uploadImage = (img: any, userId: string) => new Promise((resolve, reject) => {
  const remoteFileName = `images/${userId}.jpg`
  const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const file = firebaseCommunityService.storage().bucket().file(remoteFileName)
  const uuidToken = uuid()
  const downloadURL =
    `${FB_STORAGE_URL_PREFIX}${FB_BUCKET_NAME}/o/images%2F${userId}.jpg?alt=media&token=${uuidToken}`

  return sharp(imageBuffer)
    .resize({ height: 500 })
    .toBuffer()
    .then(buffer => file.save(
      buffer,
      {
        metadata: {
          contentType: 'image/jpeg',
          metadata: { firebaseStorageDownloadTokens: uuidToken },
        },
      }))
    .then(() => resolve({ downloadURL }))
    .catch(reject)
})
