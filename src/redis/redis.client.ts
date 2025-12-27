import { createClient } from 'redis';
import { EnvConfig } from '../config/env';

export const redisPublisher = createClient({
    url: EnvConfig.REDIS_URL || 'redis://localhost:6379'
})

export const redisSubscriber = redisPublisher.duplicate();

export async function connectRedis() {
    redisPublisher.on('error', (err) => {
        console.log('Redis publisher err', err)
    })
    redisSubscriber.on('error', (err) => {
        console.log('Redis subscriber err', err)
    })

    await redisPublisher.connect()
    await redisSubscriber.connect()

    console.log('Redix connected')
}