var twitter = require("twitter");
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

var task = process.argv[2];
var title = process.argv[3];

if(task === "do-what-it-says") {
    
	var content = fs.readFileSync("random.txt", "utf8");
	console.log(content);

	var arr = content.split(",");
	task = arr[0];
	title = arr[1].replace("\"", "");
}

console.log(task);
console.log(title);

switch(task) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThis(title);
        break;
    case "movie-this":
        movieThis(title);
        break;
    default:
        console.log("Unknown task: " + task);        
}

function myTweets() {
    var Tuser = new twitter({
    	consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

	var options = {
		count: 20,
        user_id: 333543635
    }

    Tuser.get('statuses/user_timeline', options, function(err, tweets, response) {
    	if(err) throw err;
        else {
        	//console.log(tweets);
        	for (var i = 0; i < tweets.length; i++) {
        		console.log(tweets[i].text);
		    }
	    }
    });
}

function spotifyThis(song) {
	
	if(!song)
		song = 'The Sign';

    var Suser = new spotify({
    	id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });

	var options = {
		type: 'track',
		query: song,
		limit: 50
	}

	Suser.search(options, function(err, data) {
		if(!err) {
			// console.log(data.tracks.items);
			for (var i = 0; i < data.tracks.items.length; i++) {
			  if(data.tracks.items[i].name.toLowerCase() === song.toLowerCase()) {  //Look for exact match of song name
				console.log("");
				var artists = data.tracks.items[i].artists;
				for(var j = 0; j<artists.length; j++) 
					console.log(artists[j].name);
        		console.log(data.tracks.items[i].name);
        		console.log(data.tracks.items[i].preview_url);
        		console.log(data.tracks.items[i].album.name);
        	  }
		    }
			
		}
        else {
        	console.log("Error occurred: " + err);
	    }
	});
}

function movieThis(movie) {
	if(!movie)
		movie = 'Mr. Nobody';

	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(err, response, data) {
		if(!err && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(data).Title);
			console.log("Year: " + JSON.parse(data).Year);
			console.log("IMDB Rating: " + JSON.parse(data).imdbRating);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value);
			console.log("Country: " + JSON.parse(data).Country);
			console.log("Language: " + JSON.parse(data).Language);
			console.log("Plot: " + JSON.parse(data).Plot);
			console.log("Actors: " + JSON.parse(data).Actors);
		}
		else {
			console.log("Error occurred: " + err);
		}
	});
}

