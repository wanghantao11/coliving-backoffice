// eslint-disable-next-line
const axiosInstance2 = require('axios')

const setMovedOutTenantsToUsers = async () => {
  const args = process.argv.slice(2)
  await axiosInstance2.post(args[0] + '/job/set-moved-out-tenants-to-users', {})
    .catch(({ message }) => Promise.reject({
      message, reason: 'Failed to start setMovedOutTenantsToUsers() cronjob',
    }))
}

setMovedOutTenantsToUsers()
