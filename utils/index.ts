import { hashtagLimit } from "./constants";
import { TweetData } from "./types";
import T from "./twit";

const isSpam = (tweetText: string) => {
    const hashtagPattern = /#/g;
    const numHashtags = tweetText.match(hashtagPattern);
    if(numHashtags?.length > hashtagLimit) return true;
    return false;
}

const isRetweet = (tweetText: string) => {
    const retweetPattern = /^(RT)/g;
    return retweetPattern.test(tweetText);
}

export const removeSpam = (tweetData: TweetData[]) => {
    return tweetData.filter(datum => !isSpam(datum.text))
}

export const removeRetweets = (tweetData: TweetData[]) => {
    return tweetData.filter(datum => !isRetweet(datum.text))
}

export const getTweetIds = (tweetData: TweetData[]) => {
    return tweetData.map(datum => datum.id);
}

export const retweetTweets = (tweetIds: string[]) => {
    tweetIds.forEach(id => retweet(id));
}

const retweet = (tweetId: string) => {
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
  };