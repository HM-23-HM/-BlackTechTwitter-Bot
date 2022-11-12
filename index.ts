require("dotenv").config();

import T from "./utils/twit";
import { TweetCompoundData, TweetData } from "./utils/types";
import { operationIntervalMs, searchParamsMaxResults, operationIntervalMins } from "./utils/constants";
import { getTweetIds, removeRetweets, removeSpam, retweetTweets } from "./utils";

const run = async () => {
  getTweetData();
};

const getTweetData = () => {

  const current = Date.now();
  const numOfMillisecBeforeCUrrent =
    current - (operationIntervalMins * 60 * 1000);

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
        let tweetData = removeSpam(compoundData.data);
        tweetData = removeRetweets(tweetData);
        let tweetIds = getTweetIds(tweetData);
        retweetTweets(tweetIds);
      }
    }
  );
};

console.log("Up and Running");
run();
setInterval(run, operationIntervalMs);
