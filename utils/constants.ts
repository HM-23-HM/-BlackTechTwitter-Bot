export const hashtagLimit = 4;
export const atLimit = 3; // upper limit of @'s in a tweet
export const searchParamsMaxResults = 30;
export const operationIntervalMins = 30;
export const numTweets = 3;

//60 mins x 60 secs/min x 1000ms/sec
export const tweetBatchInterval = operationIntervalMins * 60 * 1000;
