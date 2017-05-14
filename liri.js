var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var fs = require('fs');
var request = require('request');


var findArtist = function(artist) {
  return artist.name;
}


var lookUpSpotify = function(songTitle) {

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }

      var songs = data.tracks.items;
      for(var i=0; i<songs.length; i++) {
        console.log(i);
        console.log('artist(s) ' + songs[i].artists.map(findArtist));
        console.log('preview song: ' + songs[i].name);
        console.log('album: ' + songs[i].album.name);
        console.log('-----------------------------------------------------');
      }
  });
}


var lookUpTweets = function() {

  var client = new Twitter(keys.twitterKeys);

  var params = {screen_name: 'walden_danny'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for(var i=0; i<tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log(' ');
        console.log(tweets[i].text);
      }
    }
  });

}

var lookUpMovie = function(movie) {

  request('http://www.omdbapi.com/?t=' + movie, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonData = JSON.parse(body);

      console.log('Title: ' +jsonData.Title);
      console.log('Year: ' +jsonData.Year);
      console.log('Rated: ' + jsonData.Year);
      console.log('IMDB Rating: ' + jsonData.imdbRating);
      console.log('Country: ' + jsonData.Country);
      console.log('Language: ' + jsonData.Language);
      console.log('Plot: ' + jsonData.Plot);
      console.log('Actors: ' + jsonData.Actors);
      console.log('Rotten tomatoes URL: ' + jsonData.tomatoURL);
    }
  });
}


var doWhatItSays = function() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var dataArr = data.split(',');

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);

    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}


var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets' :
      lookUpTweets();
      break;
    case 'spotify-this-song':
      lookUpSpotify(functionData);
      break;
    case 'movie-this':
      lookUpMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays()
      break;
    default:
    console.log('LIRI does not know that');
  }
}

var commandOrder = function(place1, place2) {
  pick(place1, place2);
};


commandOrder(process.argv[2], process.argv[3]);
