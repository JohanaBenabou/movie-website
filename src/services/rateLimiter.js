class RateLimiter {
  constructor(maxRequests = 5, windowMs = 10000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getWaitTime() {
    if (this.canMakeRequest()) return 0;
    
    const now = Date.now();
    const oldestRequest = this.requests[0];
    return this.windowMs - (now - oldestRequest);
  }


  async execute(fn) {
    if (!this.canMakeRequest()) {
      const waitTime = this.getWaitTime();
      console.warn(`⚠️ Rate limit atteint. Attente de ${Math.ceil(waitTime / 1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.recordRequest();
    return fn();
  }
}

const apiRateLimiter = new RateLimiter(5, 10000);

export default apiRateLimiter;