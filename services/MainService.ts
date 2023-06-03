import {
  removeRetweets,
  removeSpam,
} from "../utils";
import {
  operationIntervalMins,
  tweetBatchInterval,
  searchParamsMaxResults,
} from "../utils/constants";
import { SearchParams, TweetCompoundData, TweetData } from "../utils/types";
import T from "../utils/twit";

let instance: MainService;

class MainService {

  private init = false;

  constructor() {
    if (!instance) {
      instance = this;
    }
  }

  public run() {
    if (!this.init) {
      console.log("Up and Running");
      this.tweetBatch();
      setInterval(this.tweetBatch.bind(this), tweetBatchInterval);
      this.init = true;
    } else {
      console.error("Service has already been initialized")
    }
  }

  public async tweetBatch() {
    const current = Date.now();
    const numOfMillisecBeforeCUrrent =
      current - operationIntervalMins * 60 * 1000;

    const startTimeISO = new Date(numOfMillisecBeforeCUrrent);

    const searchParams: SearchParams = {
      query: "#BlackTechTwitter",
      max_results: searchParamsMaxResults,
      start_time: startTimeISO,
    };

    const rawTweets = await MainService.getRawTweets(searchParams);
    const refinedTweets = MainService.refineTweets(rawTweets);
    const batch = MainService.getBatchToRetweet(refinedTweets, 3);

    let tweetIds = MainService.getTweetIds(batch);
    MainService.retweetTweets(tweetIds);
  };

  private static async getRawTweets(searchParams: SearchParams): Promise<TweetData[]> {
    return new Promise((resolve, reject) => {
      T.get(
        "https://api.twitter.com/2/tweets/search/recent",
        searchParams
      ).then(
        (response: { data: TweetCompoundData, res: any }) => {
          const { data } = response.data;
          resolve(data)
        })
        .catch(err => reject(err))
    })
  }

  private static refineTweets(rawTweets: TweetData[]) {

    let refinedTweets = removeRetweets(rawTweets);
    refinedTweets = removeSpam(refinedTweets);

    return refinedTweets;

  }

  private static getBatchToRetweet(tweetData: TweetData[], batchSize: number) {
    return tweetData?.slice(-batchSize);
  }

  private static getTweetIds(tweetData: TweetData[]) {
    return tweetData?.map(datum => datum.id);
  }

  private static retweetTweets(tweetIds: string[]) {
    tweetIds?.forEach(id => MainService.retweet(id));
  }

  private static retweet(tweetId?: string) {
    if (tweetId) {
      T.post(
        "https://api.twitter.com/1.1/statuses/retweet/:id.json",
        { id: tweetId },
        (err) => {
          if (err) {
            console.error("An error occured while retweeting the following tweet: ", tweetId);
            console.error(err);
          }
        }
      );
    }
  };

}

const service = new MainService();

export default service;
