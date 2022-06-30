import { StreamChat } from 'stream-chat'

const client = new StreamChat(
  process.env.GETSTREAM_CHAT_KEY,
  process.env.GETSTREAM_CHAT_SECRET
)

export { client }
