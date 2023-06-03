import { atLimit, hashtagLimit } from "./constants";
import { TweetData } from "./types";
import T from "./twit";

const isSpam = (tweetText: string) => {
    const hashtagPattern = new RegExp(/#/, "g");
    const atTagPattern = new RegExp(/@/, "g");
    const numHashtags = tweetText.match(hashtagPattern);
    const numAtTags = tweetText.match(atTagPattern);
    if(numHashtags?.length > hashtagLimit || numAtTags?.length > atLimit) return true;
    return false;
}

const isRetweet = (tweetText: string) => {
    const retweetPattern = new RegExp(/^(RT)/, "g");
    return retweetPattern.test(tweetText);
}

export const removeSpam = (tweetData: TweetData[]) => {
    return tweetData?.filter(datum => !isSpam(datum.text))
}

export const removeRetweets = (tweetData: TweetData[]) => {
    return tweetData?.filter(datum => !isRetweet(datum.text))
}
