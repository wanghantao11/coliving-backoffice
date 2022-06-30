import { client } from './client'
import { CHANNEL_TYPE } from './../../infrastructure/constants/getstream'
import { errorEventLogger } from './../../infrastructure/utils/loggers'

export const createChatToken = (iduser: string) => Promise.resolve(client.createToken(iduser))

export const addMemberToApartmentChannel = (id: string, apartmentId: number) => {
  const channelId = `apartment-${apartmentId}`
  const query = { cid: `${CHANNEL_TYPE}:${channelId}` }

  return client.queryChannels(query)
    .then(channels => channels.length > 0 ?
      Promise.all(channels.map(channel => channel.addMembers([id]))).then(() => ({ channelId }))
      :
    // Channel not exist, create a new one with the member
      Promise.resolve(
        client.channel(
          CHANNEL_TYPE,
          channelId,
          {
            name: 'Min lägenhet', // TODO handle translation
            members: [id],
            created_by: {id: 'colive-admin', name: 'Colive Administrator'},
          }
        ).create()
      ).then(() => ({ channelId }))
    ).catch(error =>
    // Mute the error if failed to add the member to apartment channel
      errorEventLogger.error({ data: error.message }))
}

export const addMemberToProjectChannel = (
  id: string, facadeId: number, projectName: string, image: string, host: any) => {
  const channelId = `project-${facadeId}`
  const query = { cid: `${CHANNEL_TYPE}:${channelId}` }

  return client.queryChannels(query)
    .then(channels => channels.length > 0 ?
      Promise.all(channels.map(channel => channel.addMembers([id]))).then(() => ({ channelId }))
      :
    // Channel not exist, create a new one with the host and the member
      Promise.resolve(
        client.channel(
          CHANNEL_TYPE,
          channelId,
          {
            name: `Mitt community - ${projectName}`,
            image,
            members: [`host-${host.id}`, id],
            created_by: {id: `host-${host.id}`, name: `${host.first_name} ${host.last_name}`},
          }
        ).create()
      ).then(() => ({ channelId }))
    ).catch(error => {
      // Mute the error if failed to add the member to project channel
      errorEventLogger.error({ data: error.message })
    })
}
