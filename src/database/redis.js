import redis from 'redis';

const { REDIS_PORT, REDIS_HOST } = process.env

const redisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT
}

const redisClient = redis.createClient(redisOptions)

redisClient.on('connect', () => {
    console.log("Connected to Redis...")
})

export default redisClient