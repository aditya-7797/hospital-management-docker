import { createClient } from 'redis';

let redisClient;

export const connectRedis = async () => {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    }
  });

  redisClient.on('error', (err) => console.error('Redis Error:', err));
  redisClient.on('connect', () => console.log('🔗 Redis client connected'));

  await redisClient.connect();
};

export const getRedisClient = () => redisClient;
