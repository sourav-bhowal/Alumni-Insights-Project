import { Redis } from "ioredis";

// Get the REDIS_URL from the environment variables
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL is not defined");
};

//  Create a new Redis instance with the REDIS_URL
export const redis = new Redis(getRedisUrl());
