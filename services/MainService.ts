import {
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
import { TweetCompoundData } from "../utils/types";
import T from "../utils/twit";


const _run = async () => {
  getTweetData();
};

const getTweetData = () => {
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
        let tweetData = removeRetweets(compoundData.data);
        const totalCount = tweetData.length;
        tweetData = removeSpam(tweetData);
        const spamFreeCount = tweetData.length;
        logSpamPercentage(totalCount, spamFreeCount);
        let tweetIds = getTweetIds(tweetData).slice(-numTweets);
        retweetTweets(tweetIds);
      }
    }
  );
};

let instance;

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
        _run();
        setInterval(_run, operationIntervalMs);
        this.init = true;
    }
  }
}

const service = new MainService();

export default service;
