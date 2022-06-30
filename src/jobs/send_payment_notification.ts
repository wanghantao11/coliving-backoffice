// eslint-disable-next-line
import axiosInstance from 'axios'

const sendPaymentNotification = async () => {
  const args = process.argv.slice(2)
  await axiosInstance.post(args[0] + '/job/send-payment-notification', {})
    .catch(({ message }) => Promise.reject({
      message, reason: 'Failed to start sendPaymentNotification() cronjob',
    }))
}

sendPaymentNotification()
