
// Dependency for npm package used
//npm init -y
//npm install moment --save
//npm install --save Node-Spotify-API
//npm install axios
//npm install dotenv
//npm install file-system --save
// Requirements
//require  dotenv to keep key private
// read and set any environment variables with the dotenv package
require("dotenv").config();

//require to import the keys.js file and store it in a variable
var keys = require("./keys.js");

//use this module `fs` the core node package for reading and writing files
// fs is a core Node package for reading and writing files
var fs = require('fs');

//require to import moment
var moment = require('moment');

// send requests using the axios package to the Bands in Town, Spotify and OMDB APIs
var axios = require('axios');
//
//send request to spotify
//utilize the node-spotify-api package in order to retrieve song information from the Spotify API
var Spotify = require('node-spotify-api');

// access spotify key information
var spotify = new Spotify(keys.spotify);
//
//initialize variable
var searchConcert = "";
var searchSong = "";
var searchMovie = "";

var searchTerm  = "";

// function movieThis will search OMDb API and output the movie information to terminal/bash window

function movieThis() {
    
    //If the user doesn't type a movie in, use the movie 'Mr. Nobody.'
    if (searchMovie === "") {
        searchMovie = "Mr. Nobody";
    }
    console.log(searchMovie);
    // built the queryUrl to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=trilogy";

    //use the axios package to retrieve data from the OMDB API. 
    //Then create a request with axios to the queryUrl
    axios.get(queryUrl).then(
        function (response) {
            

            var Title = "Title: " + response.data.Title;
            var ReleaseYear = "Release Year: " + response.data.Year;
            var Rated ="Rated: " + response.data.Rated;
            var Actors = "Actors: " + response.data.Actors;

            var IMDB = "IMDB Rating: " + response.data.imdbRating;
            var Tomatoes = "Rotten Tomatoes Rating: " + response.data.rottenTomatoesRating;  
            var Country = " Country where the movie was produced: " + response.data.Country;
            var Language  = "Language(s): " + response.data.Language;
            var Plot = "Plot: " + response.data.Plot;

        // Then we print out the movie info.
            console.log("Retrieving movie information for " + searchMovie);
            console.log(Title);
            console.log(ReleaseYear);
            console.log(Rated);
            console.log(Actors);
            console.log(IMDB);
            console.log(Tomatoes);  
            console.log(Country);
            console.log(Language);
            console.log(Plot);

            // log to log.txt.
            var dataRecord = Title + "," +  ReleaseYear+ "," +  Rated + "," + Actors + "," + IMDB  + "," + Tomatoes + "," + Country + "," + Language + "," + Plot;

            fs.appendFile('log.txt', dataRecord, function (err) {
                if (err) {
                    console.log(err);
                }
                else console.log("updated txt file");
            });


        })
}

//Function concertThis will search the Bands in Town Artist Events API
// for an artist and render the information about each event to the terminal

function concertThis() {

    //If no concert is provided then use default "Digital"
    if (searchConcert === "") {
        searchConcert="Digital";
    }       

   // built the queryUrl to the OMDB API with the movie specified
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchConcert + "/events?app_id=codingbootcamp";
    
   
    //use the axios package to retrieve data from the Bands in Town API. 
    //Then create a request with axios to the queryUrl
    
    axios.get(queryUrl).then(
        function (response) {
                var concertData = response.data[0];
                var venueName = "Venue Name: " + concertData.venue.name;
                var venueLocation = "Venue Location: " + concertData.venue.city;
                var ConcertTime = concertData.datetime;
                var removeTime = ConcertTime.split('T');
                var venueDate = "Venue Date: " + moment(removeTime[0]).format("MM/DD/YYYY");


                // log all user song requests to log.txt. Should not override the log each time.
                console.log(venueName);
                console.log(venueLocation);
                console.log(venueDate);

              
                // log to log.txt.
                var dataRecord = venueName + "," + venueLocation + "," + venueDate;
                fs.appendFile('log.txt', dataRecord, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else console.log("updated txt file");
                });
            })        
    }
        



//function spotifyThisSong utilize the node-spotify-api package to retrieve song information from the Spotify API.
// and output the song information to terminal/bash window

function spotifyThisSong() {

    //If no song is provided then use default "The Sign" by Ace of Base.
    if (searchSong === "") {
        searchSong = "The Sign Ace of Base";}

        // Then use the  object to search the song
        spotify.search({ type: 'track', query: "'" + searchSong + "'"}, function (err, data) {
        
        var artist = "Artist(s): " + data.tracks.items[0].artists[0].name;
        var songName = "Song Title: " + data.tracks.items[0].name;
        var previewLink = "Preview Link: " + data.tracks.items[0].preview_url;
        var albumName = "Album Name: " + data.tracks.items[0].album.name;
        console.log(artist);
        console.log(songName);
        console.log(previewLink);
        console.log(albumName);
       

        // log to log.txt.
        var dataRecord = artist + "," + songName + "," + previewLink + "," + albumName;
        fs.appendFile('log.txt', dataRecord, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}
//function doWhatItSays Using the fs Node package,
// LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

function doWhatItSays() {

    // read from the "random.txt" file.
    // It's important to include the "utf8" parameter or the code will provide (buffer) stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile('random.txt', 'utf8', function (error, data) {
     // If the code experiences any errors it will log the error to the console.
     if (error) {
       return console.log(error)
     }
   
     // Then split it by commas to make the data into array
     var dataArr = data.split(',')
   
     // assign the content of array as action and term for search.
       action = dataArr[0];
       searchTerm = dataArr[1];
   
     //  take action to decide which function to use
     switch (action) {
       case "concert-this":
           searchConcert = searchTerm;
           concertThis();
           break;
   
       case "spotify-this-song":
           searchSong =  searchTerm;
           spotifyThisSong();
           break;
   
       case "movie-this":
           searchMovie = searchTerm ;
           movieThis();
           break;
         }
    })
   
   }




//variable capture user commands from terminal line
var userAction = process.argv[2];
var userArgv = process.argv;


if ( userArgv.length === 3 ) {searchTerm = ""; }
  
   else{
     searchTerm = userArgv[3];

     if ( userArgv.length > 3 ){
      
       for (var i = 4; i < userArgv.length; i++) {
          searchTerm = searchTerm + " " + userArgv[i];
           }
     }
}    

//liri will take in one of the commands
// determine which action to take depending on user input commands.

switch (userAction) {
    case "concert-this":
           searchConcert = searchTerm;
           concertThis();
        break;

    case "spotify-this-song":
           searchSong  = searchTerm;
           spotifyThisSong();
        break;

    case "movie-this":
           searchMovie =  searchTerm;
           movieThis();
        break;

    case "do-what-it-says":
           doWhatItSays();
        break;
   
    default: console.log(userAction);
       break;

}

