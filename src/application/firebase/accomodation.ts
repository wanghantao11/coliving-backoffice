import * as sharp from 'sharp'
import * as uuid from 'uuid/v4'

import { firebaseBackofficeService } from './backoffice'
import { FB_STORAGE_URL_PREFIX } from './../../infrastructure/constants'

const NEWSLETTER_BUCKET_NAME = process.env.FB_STORAGE_BUCKET_BACKOFFICE

export const uploadImage = (accomodationId: string, img: any) => new Promise((resolve, reject) => {
  const currentTimestamp = Date.now()
  const remoteFileName = `accomodations/${accomodationId}_${currentTimestamp}.jpg`
  const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const file = firebaseBackofficeService.storage().bucket().file(remoteFileName)
  const uuidToken = uuid()
  const downloadURL =
    `${FB_STORAGE_URL_PREFIX}${NEWSLETTER_BUCKET_NAME}/o/accomodations%2F${accomodationId}_${currentTimestamp}.jpg?alt=media&token=${uuidToken}`

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
    const file = firebaseBackofficeService.storage().bucket().file(`/accomodations/${filePath}`)
    file.delete()
      .then(() => resolve({ message: 'Deleted from Firebase' }))
      .catch(reject)
  })
