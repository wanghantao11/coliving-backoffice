// eslint-disable-next-line
const axios = require('axios')

const createMonthlyRentPayment = async () => {
  const args = process.argv.slice(2)
  await axios.post(args[0] + '/job/create-monthly-rent', {})
    .catch(({ message }) => Promise.reject({
      message, reason: 'Failed to start createMonthlyRentPayment() cronjob',
    }))
}

createMonthlyRentPayment()
