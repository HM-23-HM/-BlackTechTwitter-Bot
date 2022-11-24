import {
    getBatchToRetweet,
  getTweetIds,
  logSpamPercentage,
  removeRetweets,
  removeSpam,
  retweetTweets,
} from "../utils";
import {
    numTweets,
  operationIntervalMins,
  operationIntervalMs,
  searchParamsMaxResults,
} from "../utils/constants";
import { TweetCompoundData, TweetData } from "../utils/types";
import T from "../utils/twit";


let instance: MainService;

class MainService {

   private init = false;
   private prevTweetedIds: string[] = [];
   private prevTweetThreshold = 10;

  constructor() {
    if(!instance){
        instance = this;
    }
  }

  public run() {
    if(!this.init){
        console.log("Up and Running");
        this.getTweetData();
        setInterval(this.getTweetData.bind(this), operationIntervalMs);
        this.init = true;
    } else {
        console.log("Service has already been initialized")
    }
  }

  private getTweetData(service?: MainService) {
    const current = Date.now();
    const numOfMillisecBeforeCUrrent =
      current - operationIntervalMins * 60 * 1000;
  
    const startTimeISO = new Date(numOfMillisecBeforeCUrrent);
  
    const searchParams = {
      query: "#BlackTechTwitter",
      max_results: searchParamsMaxResults,
      start_time: startTimeISO,
    };

    T.get(
      "https://api.twitter.com/2/tweets/search/recent",
      searchParams,
      (err, compoundData: TweetCompoundData, response) => {
        if (err) {
          console.error("Error getting tweets at: ", Date.now().toLocaleString());
          console.error(err);
        } else {
            if(compoundData.data.length > 0){
                console.log("Count 1 - Raw: ", compoundData.data.length)
                let tweetData = removeRetweets(compoundData.data);
                console.log("Count 2 - Retweets have been removed: ", tweetData.length)
                tweetData = this.removePreviouslyTweeted(tweetData);
                console.log("Count 3 - Prev tweeted have been removed: ", tweetData.length)
      
                const totalCount = tweetData.length;
                tweetData = removeSpam(tweetData);
                console.log("Count 4 - Spam has been removed: ", tweetData.length)
                const spamFreeCount = tweetData.length;
        
                const batch = getBatchToRetweet(tweetData, 3);
                console.log("Count 5 - Batch size: ", batch.length);
                logSpamPercentage(totalCount, spamFreeCount);
                let tweetIds = getTweetIds(batch);
                console.log({tweetIds, previousIds: this.prevTweetedIds})
        
                retweetTweets(tweetIds);
                this.addToPreviouslyTweetedIds(tweetIds);
                console.log({newPreviousIds: this.prevTweetedIds})
            }
        }
      }
    );
  };

  private addToPreviouslyTweetedIds(tweetIds: string[]){
    if(this.prevTweetedIds.length + tweetIds.length > this.prevTweetThreshold){
        this.resetPreviouslyTweetedIds();
        this.prevTweetedIds.concat(tweetIds);
    } else {
        this.prevTweetedIds = this.prevTweetedIds.concat(tweetIds);
    }
  }

  private resetPreviouslyTweetedIds(){
    this.prevTweetedIds = [];
  }

  public removePreviouslyTweeted(tweetData: TweetData[]){
    return tweetData.filter(datum => !this.hasAlreadyBeenRetweeted(datum.id))
  }

  private hasAlreadyBeenRetweeted(tweetId: string){
        if(this.prevTweetedIds.includes(tweetId)) return true;
        return false;
  }
}

const service = new MainService();

export default service;
