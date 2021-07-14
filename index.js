require("dotenv").config();

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var delayBetweenSearches = 30 * 60 * 1000

function retweet(idOfTweet){
     T.post(
        "https://api.twitter.com/1.1/statuses/retweet/:id.json",
        { id: idOfTweet },
        (err, tweetData, response) => {
          if (err) {
            console.log("There was an error retweeting this");
            return;
          } else {
            console.log("Success! ID of tweet is: ", idOfTweet);
            return;
          }
        }
      )
}

function collectTweets() {

  let current = Date.now();
  let numOfMinutesBeforeCurrent = 10;
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
        console.log("Error getting tweets");
      } else {
        let listOfIDs = [];
        let alreadyRetweeted = {};
        tweetData.data.forEach((element) => listOfIDs.push(element.id));
        console.log(listOfIDs)
        for(let i = 0; i <= 2 ; i++){
               if(alreadyRetweeted[listOfIDs[i]] != true){
                 alreadyRetweeted[listOfIDs[i]] = true
                 retweet(listOfIDs[i])
               } else {
                 console.log("Old Tweet")
               }
        }
      }
    }
  );

}

console.log("Up and Running")
collectTweets()
setInterval(collectTweets, delayBetweenSearches)