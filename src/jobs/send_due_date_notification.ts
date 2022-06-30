// eslint-disable-next-line
const axiosHandler = require('axios')

const sendDueDateNotification = async () => {
  const args = process.argv.slice(2)
  await axiosHandler.post(args[0] + '/job/send-due-date-notification', {})
    .catch(({ message }) => Promise.reject({
      message, reason: 'Failed to start sendDueDateNotification() cronjob',
    }))
}

sendDueDateNotification()
