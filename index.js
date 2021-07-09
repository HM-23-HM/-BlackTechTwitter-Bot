require('dotenv').config();

const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.APPLICATION_CONSUMER_KEY,
    consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


const stream = T.stream = T.stream('statuses/filter', {track: '#BlackTechTwitter'});


function responseCallback (err, data, response) {
    console.log(err);
}

stream.on('tweet', tweet => {
    T.post('statuses/retweet/:id', {id: tweet.id_str}, responseCallback);
})