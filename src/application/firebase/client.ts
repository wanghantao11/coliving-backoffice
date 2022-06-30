import * as sharp from 'sharp'
import * as uuid from 'uuid/v4'

import { firebaseBackofficeService } from './backoffice'
import { FB_STORAGE_URL_PREFIX } from './../../infrastructure/constants'

const BUCKET_NAME = process.env.FB_STORAGE_BUCKET_BACKOFFICE

export const uploadLogo = (clientId: string, img: any) => new Promise((resolve, reject) => {
  const currentTimestamp = Date.now()
  const remoteFileName = `logos/${clientId}_${currentTimestamp}.jpg`
  const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const file = firebaseBackofficeService.storage().bucket().file(remoteFileName)
  const uuidToken = uuid()
  const downloadURL =
    `${FB_STORAGE_URL_PREFIX}${BUCKET_NAME}/o/logos%2F${clientId}_${currentTimestamp}.jpg?alt=media&token=${uuidToken}`

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
