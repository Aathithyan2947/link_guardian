import { createClient } from 'redis';

let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    // Don't exit process, Redis is optional for basic functionality
  }
};

export const getRedisClient = () => {
  return redisClient;
};

export const setCache = async (key, value, expiration = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, expiration, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

export const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
};

export const flushCache = async () => {
  if (!redisClient) return false;
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Redis flush error:', error);
    return false;
  }
};

export default redisClient;