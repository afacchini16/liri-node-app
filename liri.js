var keysObject = require("./keys.js");
var Twitter = require('twitter');
var spotify = require('spotify');
var omdb = require('omdb');
var request = require('request');
var fs = require("fs");
var userInput = process.argv[2];
var consumerKey = "";
var consumerSecret = "";
var accessTokenKey = "";
var accessTokenSecret = "";

// Load key variables from keys.js file
consumerKey = keysObject.twitterKeys.consumer_key;
consumerSecret = keysObject.twitterKeys.consumer_secret;
accessTokenKey = keysObject.twitterKeys.access_token_key;
accessTokenSecret = keysObject.twitterKeys.access_token_secret;

// Create new instance of Twitter
var client = new Twitter({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
});

// Twitter:
if (userInput === "my-tweets"){
    // Function that handles twitter requests
    twitterRequest();
}
// Spotify:
else if (userInput === "spotify-this-song"){
    // Get song name from user
    var songName = process.argv[3];
    //Function that handles Spotify requests
    spotifyRequest(songName);
}
// OMDB:
else if (userInput === "movie-this"){
    // Get movie name from user
    var movieName = process.argv[3];
    
    // If user doesn't input a movie, set to "Mr. Nobody"
    if(!movieName){
        movieName = "Mr. Nobody"
        OMDBrequest(movieName);
    }
    else {
        // Call OMDBRequest with the user's input
        OMDBrequest(movieName);
    }


}
// FS:
else if (userInput === "do-what-it-says"){
    // Reads data from random.txt file
    fs.readFile("random.txt", "utf-8", function(error, data){
        // Split the file into two indices of an array
        var dataArray = data.split(",");
        // Song name is the second index of the array
        var songName = dataArray[1];
        // Pass the song name input from the user to the request function
        spotifyRequest(songName);
    })
}

function twitterRequest(){
    var params = {screen_name: 'afacchini16', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        // If success: 
        if (!error) {
            // Iterates through the array of tweets
            for (i = 0; i < 2; i++) {
                // Console log each tweet
                console.log(tweets[i].text);
            }
        }
        // If failure
        if (error){
            console.log("ERROR");

        }
});
}

function spotifyRequest(songName){
    // If the user doesn't enter a song name, set to "The Sign by Ace of Base"
    if (!songName) {
    songName = "The Sign Ace of Base"
}
    // Get the info from the API call
    spotify.search({
        type: 'track',
        query: songName,
        limit: 1,
    }, function (error, data){
        // If API call was unsuccessful
        if (error){
            console.log("ERROR" + error);
            return;
        }
        // If successful API call
        else if (songName){
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song name: " + data.tracks.items[0].name);
            console.log(data.tracks.items[0].album.artists[0].external_urls);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    })
}
// OMDB API call
function OMDBrequest(movieName){
    // API call request
    request(`http://www.omdbapi.com/?t=${movieName}`, function(error, data, body){
        // If unsuccessful API call
        if (error) {
            console.log("ERROR");
        }
        // If success
        else {
            // Parse to JSON object
            var results = JSON.parse(body);
            
            // Get the website first
            var website = results.Website;
            // Get Rotten Tomatoes Rating next
            var rottenTomatoesRating = results.Ratings[1].Value;

            // If the movie doesn't have a website, set value of website variable
            if (!website){
                website = "No website found!"
            }
            // If movie doesn't have Rotten Tomatoes rating, set
            if (!rottenTomatoesRating){
                rottenTomatoesRating = "Rotten Tomatoes Rating NOT Found!"
            }
                // Display all movie data after checking for website and
                // Rotten Tomatoes rating
                console.log(`
                Movie Title: ${results.Title}
                Year Released: ${results.Year}
                IMDB Rating: ${results.imdbRating}
                Country of Production: ${results.Country}
                Language: ${results.Language}
                Plot: ${results.Plot}
                Actors: ${results.Actors}
                Rotten Tomatoes Rating: ${results.Ratings[1].Value}
                Website: ${results.Website}
                `);
           
        }
    })
}