require("dotenv").config();

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var delayBetweenSearches = 7 * 60 * 1000


function retweet(idOfTweet){
     T.post(
        "https://api.twitter.com/1.1/statuses/retweet/:id.json",
        { id: idOfTweet },
        (err, data, response) => {
          if (err) {
            console.log("There was an error retweeting this");
            return;
          } else {
            console.log("Success!");
            return;
          }
        }
      )
}

function collectTweets() {

  let current = Date.now();
  let numOfMinutesBeforeCurrent = 5;
  let numOfMillisecBeforeCUrrent = current - (numOfMinutesBeforeCurrent * 60 * 1000);

  let startTimeISO = new Date(numOfMillisecBeforeCUrrent);

  var delayBetweenRetweets = 0 * 60 * 1000

  let searchParams = {
    query: "#BlackTechTwitter",
    max_results: 10,
    start_time: startTimeISO,
  };


  T.get(
    "https://api.twitter.com/2/tweets/search/recent",
    searchParams,
    (err, data, response) => {
      if (err) {
        console.log("Error getting tweets");
      } else {
        let listOfIDs = [];
        data.data.forEach((element) => listOfIDs.push(element.id));
        for(let i=0; i <= 2 ;i++){
            setTimeout(() => {retweet(listOfIDs[i])}, delayBetweenRetweets)
        }
      }
    }
  );

  // console.log("The bot is running");
}

console.log("Up and Running")
collectTweets()
setInterval(collectTweets, delayBetweenSearches)