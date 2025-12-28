import { createClient } from 'redis';
import { EnvConfig } from '../config/env';

export const redisPublisher = createClient({
    url: EnvConfig.NODE_ENV! === 'test' ? process.env.TEST_REDIS_URL! : EnvConfig.REDIS_URL || 'redis://localhost:6379'
})

export const redisSubscriber = redisPublisher.duplicate();

export async function connectRedis() {
    while (true) {
        try {
            redisPublisher.on('error', (err) => {
                console.log('Redis publisher err', err)
            })
            redisSubscriber.on('error', (err) => {
                console.log('Redis subscriber err', err)
            })

            await redisPublisher.connect()
            await redisSubscriber.connect()

            console.log('Redis connected')
            break
        } catch (error) {
            console.log(`Redis is not Ready, retrying..,`, error);
            await new Promise((r) => setTimeout(r, 3000))
        }
    }
}