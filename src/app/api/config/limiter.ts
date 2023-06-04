//THIS IS A LIMITER INSTANCE APPLIED FOR ALL ROUTES 
//limiters can be applied to specific paths too

import { RateLimiter } from "limiter"

export const limiter = new RateLimiter({
    tokensPerInterval: 3,
    interval: "min",
    fireImmediately: true,
})