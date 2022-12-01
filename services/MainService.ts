import {
    getBatchToRetweet,
  getTweetIds,
  getSpamPercentage as getSpamReport,
  removeRetweets,
  removeSpam,
  retweetTweets,
} from "../utils";
import {
  operationIntervalMins,
  operationIntervalMs,
  searchParamsMaxResults,
} from "../utils/constants";
import { TweetCompoundData, TweetData } from "../utils/types";
import T from "../utils/twit";


let instance: MainService;

class MainService {

   private init = false;

  constructor() {
    if(!instance){
        instance = this;
    }
  }

  public run() {
    if(!this.init){
        console.log("Up and Running");
        this.tweetBatch();
        setInterval(this.tweetBatch.bind(this), operationIntervalMs);
        this.init = true;
    } else {
        console.log("Service has already been initialized")
    }
  }

  public async tweetBatch() {
    console.log("Up and Running")
    const current = Date.now();
    const numOfMillisecBeforeCUrrent =
      current - operationIntervalMins * 60 * 1000;
  
    const startTimeISO = new Date(numOfMillisecBeforeCUrrent);
  
    const searchParams = {
      query: "#BlackTechTwitter",
      max_results: searchParamsMaxResults,
      start_time: startTimeISO,
    };


    const stats = await T.get(
      "https://api.twitter.com/2/tweets/search/recent",
      searchParams
    ).then(
      (response: { data: TweetCompoundData, res: any }) => {
        const compoundData = response.data;
            if(compoundData.data.length > 0){
                const stats = {};

                stats["Count 1 - Raw"] = compoundData.data.length;

                let tweetData = removeRetweets(compoundData.data);
                stats["Count 2 - Retweets have been removed"] = tweetData.length;

                const totalCount = tweetData.length;
                tweetData = removeSpam(tweetData);
                stats["Count 3 - Spam has been removed"] = tweetData.length;

                const spamFreeCount = tweetData.length;
        
                const batch = getBatchToRetweet(tweetData, 3);
                stats["Count 4 - Batch size"] = batch.length;

                stats["Spam report"] = getSpamReport(totalCount, spamFreeCount);

                let tweetIds = getTweetIds(batch);
        
                retweetTweets(tweetIds);
                return stats;

            }
      })
      .catch(console.error);

    return stats;

  };

}

const service = new MainService();

export default service;
