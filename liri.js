
var userChoice = process.argv[2];
var userSearch = process.argv[3];
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;


// user choices
var myTweets = "my-tweets";
var spotifyThisSong = "spotify-this-song";
var movieThis = "movie-this";
var doWhatItSays = "do-what-it-says";




// input Vars
if(userChoice == myTweets) {
    twitterTweets();
// Spotify input
} else if(userChoice == spotifyThisSong) {
    spotifySearch(userSearch);
// Movie input
} else if( userChoice == movieThis) {
    moviesSearch(userSearch);
// Do what it says input
} else if(userChoice == doWhatItSays) {
    doWhat(userSearch);
}




//twitter function
function twitterTweets(){

    var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret, 
    });

    // Setting up my account and 20 tweet limit
    var params = {
        screen_name: 'TheDanielStarks',
        count: '20',
    }

    //get the tweets and display them
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if(!error){
            for(tweet in tweets) {

                var dateAndTime = new Date(tweets[tweet].created_at); //set up tweet dates

                console.log("Tweet #: " + (parseInt(tweet)+1));     //tweet #
                console.log(dateAndTime.toString().slice(0, 24));   //tweet date
                console.log(tweets[tweet].text);                    //tweet text
                console.log(" ");                                   //separate tweets

            }
        } 
    })
}


//spotify function
function spotifySearch(userSearch) {

    var spotify = new Spotify({
      id: '2ac1bbf7d37f4a5d8b4795f40be185b3',
      secret: '65a5562a790248acb76a9a8ee78a5f56'
    });

    if(!userSearch){
        userSearch = "The Sign";
    }
    spotify.search({ type: "track", query: userSearch }, function(err, data) {
        if(!err){
            var songSearch = data.tracks.items;

            // only show the 1st record of the song
            for (var i = 0; i < 1; i++) {
                if (songSearch[i]) {
                    console.log("Artist: " + songSearch[i].artists[0].name);
                    console.log("Song: " + songSearch[i].name);
                    console.log("Album: " + songSearch[i].album.name);
                    console.log("Preview Url: " + songSearch[i].preview_url);
                }
            }
        }   else {
            console.log("Error :"+ err);
            return;
        }
    });
};


//movies function
function moviesSearch(userSearch){

    //defaul movie search
    if(!userSearch){
        userSearch = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }

    //if a title is entered
    var queryURL = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=40e9cece";
    request(queryURL, function (err, response, body) {

        if(err) throw err;

        var readableData = JSON.parse(body);

        console.log('Title: ' + readableData.Title);
        console.log('Year: ' + readableData.Year);
        console.log('imdbRating: ' + readableData.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + readableData.Ratings[1].Value);
        console.log('Country: ' + readableData.Country);
        console.log('Language: ' + readableData.Language);
        console.log('Plot: ' + readableData.Plot);
        console.log('Actors: ' + readableData.Actors);

    });
}

//do what function
function doWhat(userSearch) {
    
    fs.readFile('random.txt', 'utf-8', function(err, data){
        
        var things = data.split(',');
        
        if(things[0] === spotifyThisSong){
            userSearch = things[1];
            spotifySearch(userSearch);
        }
    })
}




















