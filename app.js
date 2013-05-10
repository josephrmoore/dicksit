var tweet;
var request = require('request');
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'hejurBT2zq0ME6FewKq2A',
  consumer_secret: 'EYPpNtibd8G9Cb8OD4wn2Q6QZgUUNUhqPVxfnc8mc',
  access_token_key: '16000959-CcfvOUFBWIiR2BtsbaKPBDJz5zohFzZ9KuU0MFsIt',
  access_token_secret: '8g0lUh9tSnS6UAbbf7sw7orpl3xhKbQowNnraLIa8'
});
var players_client = [];
var players = [];
var player_threads = [];
var max_players = 2;
var state = 1;
var WebSocketServer = require('ws').Server;
var game_socket = new WebSocketServer({port: 8080});
var player_socket = new WebSocketServer({port: 8081});
var game;
var chosen_images = [];
var player_1;
var player_2;
var image_threshhold = 20;

request('http://api.4chan.org/b/catalog.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {

	// get all the threads with images in them
	var catalog = JSON.parse(body);
	pages = catalog.length;
	image_threads = [];
	for(var i=0; i<pages; i++){
		for(var j=0; j<catalog[i].threads.length; j++){
			var threads = catalog[i].threads;
			if(threads[j].images > image_threshhold){
				image_threads.push(threads[j]);
			}
		}
	}
	// "image_threads" is now populated with the thread objects that have more than "image_threshhold" images
  }
})


game_socket.on('connection', function(client) {
	var total_images = 0;
	game = client;
	game.on('message', function(message) {
        if(state==1){
			twit.search(message, {}, function(err, data) {
				var l = data.results.length;
				var r = Math.floor(Math.random()*l);
				tweet = {
					"tweet" : JSON.stringify(data.results[r])
				};
				game.send(JSON.stringify(tweet));
				// get threads from 4chan api, in callback - node.js curl? find?
				state+=1;
				for(var i=0; i<players_client.length; i++){
					players_client[i].send("unlocked");
				}
			});
		} else if (state == 2){
			// wait
		} else if (state == 3){
			total_images += 1;
			client.send(JSON.stringify({"channel":"image", "data" : message}));
			if(total_images == players_client.length){
				state++;				
			}
		} else if (state == 4){
			for(var i=0; i<players_client.length; i++){
				if(message == "image-"+(i+1)){
					players_client[i].send("winner");
				} else {
					players_client[i].send("loser");
				}
			}	
		}
    });
});
player_socket.on('connection', function(client) {
	players_client.push(client);
	var images = [];
	var chosen_img = "";
	var image_thread_index = Math.floor(Math.random()*image_threads.length);
	request('http://api.4chan.org/b/res/'+ image_threads[image_thread_index].no +'.json', function (error, response, body) {
		var thread = JSON.parse(body);
		var total_posts = thread.posts.length;
		for(var n=0; n<total_posts; n++){
			if(thread.posts[n].tim && thread.posts[n].ext){
				images.push(thread.posts[n].tim + thread.posts[n].ext);
			}
		}
	});
	client.on('close',function(){
		console.log('disconnected');
		for(var i=0;i<players_client.length;i++){
			if(players_client[i]==client){
				players_client.splice(i, 1);
			}
		}
	});
	client.on('message', function(message) {
		if(state==1){
			// wait
		} else if (state == 2){
			client.send(JSON.stringify(images));
			state += 1;
		} else if (state == 3){
			game.send(message);
		} else if (state == 4){
			
		}
		
    });
});