import { atLimit, hashtagLimit } from "./constants";
import { TweetData } from "./types";
import T from "./twit";

const isSpam = (tweetText: string) => {
    const hashtagPattern = /#/g;
    const atTagPattern = /@/g;
    const numHashtags = tweetText.match(hashtagPattern);
    const numAtTags = tweetText.match(atTagPattern);
    if(numHashtags?.length > hashtagLimit || numAtTags?.length > atLimit) return true;
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

export const logSpamPercentage = (totalCount: number, spamFreeCount: number) => {
    const percentage = Math.round((1 - (spamFreeCount/totalCount)) * 100);
    console.log(`For a batch of ${totalCount} tweets, the spam percentage is: ${percentage}% `)
}