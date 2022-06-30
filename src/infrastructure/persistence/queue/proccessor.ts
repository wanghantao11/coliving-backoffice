import axios from 'axios'
import { OfferQueue } from './offer.queue'

export const queueProcessInitialization = () =>
  OfferQueue.process('requestOffer', async (job: any) => {
    await axios.post(
      process.env.BACKOFFICE_BACKEND + '/offer-queue/search-offer',
      job.data
    )
  })
