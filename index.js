require("dotenv").config();

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var stream = T.stream("statuses/filter", { track: "#BlackTechTwitter" });

var alreadyRetweeted = [];


stream.on("tweet", (tweet) => {
  if (!alreadyRetweeted.includes(tweet.id_str)) {
      if(alreadyRetweeted.length == 5){
          alreadyRetweeted = []
      }
      alreadyRetweeted.push(tweet.id_str)
    T.post(
      "https://api.twitter.com/1.1/statuses/retweet/:id.json",
      { id: tweet.id_str },
      function (err, data, response) {
        if (err) {
          console.log("Something went wrong. Here is the error ", err);
        } else {
          console.log("Success!");
        }
      }
    );
  }
});

console.log("The bot is running");
