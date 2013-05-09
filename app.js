var tweet;
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'hejurBT2zq0ME6FewKq2A',
  consumer_secret: 'EYPpNtibd8G9Cb8OD4wn2Q6QZgUUNUhqPVxfnc8mc',
  access_token_key: '16000959-CcfvOUFBWIiR2BtsbaKPBDJz5zohFzZ9KuU0MFsIt',
  access_token_secret: '8g0lUh9tSnS6UAbbf7sw7orpl3xhKbQowNnraLIa8'
});
var players = [];
var state = 0;
var WebSocketServer = require('ws').Server;
var game_socket = new WebSocketServer({port: 8080});
var player_socket = new WebSocketServer({port: 8081});
var game;
var chosen_images = [];

game_socket.on('connection', function(client) {
	game = client;
	game.on('message', function(message) {
        if(state==0){
			twit.search(message, {}, function(err, data) {
				var l = data.results.length;
				var r = Math.floor(Math.random()*l);
				tweet = {
					"tweet" : JSON.stringify(data.results[r])
				}
				// get threads from 4chan api, in callback - node.js curl? find?
					state+=1;
					for(var i=0; i<players.length; i++){
						players[i].send({
							"id" : i,
							"thread" : ""
						}); // add thread from 4chan curl instead of quotes
					}
					game.send(tweet);
			});
		} else if (state == 1){
			var player_id = message.id;
			var image_url = message.image;
			game.send({
				"id": player_id,
				"image" : image_url
			});
			state++;
		} else if (state == 2){
			var winner = message.id;
			for(var i=0; i<players.length; i++){
				if(i == winner){
					players[i].send({
						"winner" : true
					});
				} else {
					players[i].send({
						"winner" : true
					});
				}
			}
			state++;
		} else if (state == 3){
			
		}
    });
}

player_socket.on('connection', function(client) {
	players.push(client);
	client.on('close',function(){
		console.log('disconnected');
		for(var i=0;i<players.length;i++){
			if(players[i]==client){
				players.splice(i, 1);
			}
		}
	});
	client.on('message', function(message) {
        if(state==0){
			// wait
		} else if (state == 1){
			
		} else if (state == 2){
			// wait
		} else if (state == 3){
			
		}
		
    });
}