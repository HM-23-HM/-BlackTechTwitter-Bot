require("dotenv").config();

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

//60 mins x 60 secs/min x 1000ms/sec
var delayBetweenSearches = 60 * 60 * 1000

function retweet(idOfTweet){
     T.post(
        "https://api.twitter.com/1.1/statuses/retweet/:id.json",
        { id: idOfTweet },
        (err) => {
          if (err) {
            console.log("There was an error retweeting this");
          } else {
            console.log("Successfully retweeted: ", idOfTweet);
          }
        }
      )
}

function getTweets() {

  let current = Date.now();
  let numOfMinutesBeforeCurrent = 30;
  let numOfMillisecBeforeCUrrent = current - (numOfMinutesBeforeCurrent * 60 * 1000);

  let startTimeISO = new Date(numOfMillisecBeforeCUrrent);

  let searchParams = {
    query: "#BlackTechTwitter",
    max_results: 10,
    start_time: startTimeISO,
  };


  T.get(
    "https://api.twitter.com/2/tweets/search/recent",
    searchParams,
    (err, tweetData, response) => {
      if (err) {
        console.log({response})
        console.log("Error getting tweets");
      } else {
        console.log({response})
        const tweets = new Set(tweetData.data.map(tweet => tweet.id));
        tweets.forEach(tweet => retweet(tweet))
      }
    }
  );

}

console.log("Up and Running")
getTweets()
setInterval(getTweets, delayBetweenSearches)