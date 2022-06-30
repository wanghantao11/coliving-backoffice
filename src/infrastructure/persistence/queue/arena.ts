import * as Arena from 'bull-arena'
import config from '../../../../config/app-config'

export const arenaConfig = Arena({
  queues: [
    {
      // Name of the bull queue, this name must match up exactly with what you've defined in bull.
      name: 'offer',
      // Hostname or queue prefix, you can put whatever you want.
      hostId: 'colive',
      url: config.REDIS_URL,
    },
  ],
},
{
  port: 8080,
  // Make the arena dashboard become available at {my-site.com}/arena.
  basePath: '/arena',
  // Let express handle the listening.
  disableListen: true,
})
