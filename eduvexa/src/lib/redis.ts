import Redis from "ioredis";


let redis: Redis | null = null;

function getRedisClient(): Redis | null {

  if (!process.env.REDIS_URL) {
    console.warn("⚠️ REDIS_URL not set. Redis caching will be disabled.");
    return null;
  }


  if (!redis) {
    try {

      const redisUrl = process.env.REDIS_URL;
      if (!redisUrl) {
        throw new Error("REDIS_URL is undefined");
      }
      
      const isTLS = redisUrl.startsWith("rediss://");
      const isCloud = redisUrl.includes("@") && !redisUrl.includes("localhost");
      

      let redisConfig: any = {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        enableReadyCheck: true,
        lazyConnect: false,

        connectTimeout: 10000,

        keepAlive: 30000,
      };

      // Cloud Redis TLS/SSL configuration
      if (isTLS) {
        redisConfig.tls = {
          rejectUnauthorized: false, 
        };
      }

      // Create Redis instance
      redis = new Redis(redisUrl, redisConfig);

      redis.on("connect", () => {
        console.log(`✅ Connected to ${isCloud ? "Redis Cloud" : "Redis"}`);
      });

      redis.on("ready", () => {
        console.log("✅ Redis is ready");
      });

      redis.on("error", (error) => {
        console.error("❌ Redis connection error:", error.message);

      });

      redis.on("close", () => {
        console.log("⚠️ Redis connection closed");
      });

      redis.on("reconnecting", () => {
        console.log("🔄 Redis reconnecting...");
      });
    } catch (error) {
      console.error("❌ Failed to initialize Redis:", error);
      return null;
    }
  }

  return redis;
}


export default getRedisClient;

export async function safeRedisOperation<T>(
  operation: (client: Redis) => Promise<T>,
  fallback?: T
): Promise<T | null> {
  const client = getRedisClient();
  if (!client) {
    return fallback ?? null;
  }

  try {
    return await operation(client);
  } catch (error) {
    console.error("❌ Redis operation failed:", error);
    return fallback ?? null;
  }
}
