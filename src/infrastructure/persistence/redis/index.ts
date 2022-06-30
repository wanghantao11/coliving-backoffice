import * as redis from 'redis'
import * as util from 'util'

export const redisClient = redis.createClient(process.env.REDIS_URL)
export const getAsync = util.promisify(redisClient.get).bind(redisClient)
