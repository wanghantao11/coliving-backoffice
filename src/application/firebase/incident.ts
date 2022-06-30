import * as sharp from 'sharp'
import * as uuid from 'uuid/v4'

import { firebaseCommunityService } from './community'
import { FB_STORAGE_URL_PREFIX } from './../../infrastructure/constants'

const FB_BUCKET_NAME = process.env.FB_STORAGE_BUCKET

export const uploadImage = (uploaderId: string | number, img: any) => new Promise((resolve, reject) => {
  const currentTimestamp = Date.now()
  const remoteFileName = `incidents/${uploaderId}_${currentTimestamp}.jpg`
  const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const file = firebaseCommunityService.storage().bucket().file(remoteFileName)
  const uuidToken = uuid()
  const downloadURL =
    `${FB_STORAGE_URL_PREFIX}${FB_BUCKET_NAME}/o/incidents%2F${uploaderId}_${currentTimestamp}.jpg?alt=media&token=${uuidToken}`

  return sharp(imageBuffer)
    .resize({ height: 2000 })
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

export const deleteImage = (filePath: string) =>
  new Promise((resolve, reject) => {
    const file = firebaseCommunityService.storage().bucket().file(`/incidents/${filePath}`)
    file.delete()
      .then(() => resolve({ message: 'Deleted from Firebase' }))
      .catch(reject)
  })
