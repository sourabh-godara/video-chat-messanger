import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const getRetryStrategy = (type:'publisher' | 'subscriber' | 'redis') => (times:number) => {
  if (times > 20) {
    console.log(
      `Too many attempts to reconnect. Redis ${type} connection was terminated`
    );

    return null;
  }

  const delay = times * 500;
  console.log(`Redis ${type}: retrying connection in ${delay}ms (attempt ${times})`);
  return delay;
};


export const publisher = new Redis(REDIS_URL, {
  retryStrategy: getRetryStrategy("publisher"),
  maxRetriesPerRequest: null,
});

export const subscriber = new Redis(REDIS_URL, {
  retryStrategy: getRetryStrategy("subscriber"),
  maxRetriesPerRequest: null,
});

export const redis = new Redis(REDIS_URL, {
  retryStrategy: getRetryStrategy("redis"),
  maxRetriesPerRequest: null,
});

publisher.on("error", (err) => console.error("Redis Publisher Error", err));
publisher.on("connect", () => console.log("Redis Publisher connected successfully."));

subscriber.on("error", (err) => console.error("Redis Subscriber Error", err));
subscriber.on("connect", () => console.log("Redis Subscriber connected successfully."));