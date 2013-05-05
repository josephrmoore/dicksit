var tweet;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'hejurBT2zq0ME6FewKq2A',
  consumer_secret: 'EYPpNtibd8G9Cb8OD4wn2Q6QZgUUNUhqPVxfnc8mc',
  access_token_key: '16000959-CcfvOUFBWIiR2BtsbaKPBDJz5zohFzZ9KuU0MFsIt',
  access_token_secret: '8g0lUh9tSnS6UAbbf7sw7orpl3xhKbQowNnraLIa8'
});
var clients = [];

// twit.stream('statuses/filter', {'track':'me'}, function(stream) {
//   stream.on('data', function (data) {
// 	//     console.log(data.text);
// 	// console.log("\n\r");
// 	clients.forEach(function(client){
// 		client.send(data.text);
// 	});
// 	// for(var i=0;i<clients.length){
// 	// 	clients[i].send(data.text);
// 	// }
//   });
// });
// 
var state = 0;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var wss1 = new WebSocketServer({port: 8081});
var wss2 = new WebSocketServer({port: 8082});

wss.on('connection', function(ws) {
	clients.push(ws);
	ws.on('close',function(){
		console.log('disconnected');
		for(var i=0;i<clients.length;i++){
			if(clients[i]==ws){
				clients.splice(i, 1);
			}
		}
	});
    ws.on('message', function(message) {
        if(state==0){
			twit.search(message, {}, function(err, data) {
				var l = data.results.length;
				var r = Math.floor(Math.random()*l);
				tweet = JSON.stringify(data.results[r]);
				ws.send(tweet);
				ws.send("waiting");
				state++;
			});
		} else if (state == 1){
			
		}
    });
});



wss1.on('connection', function(ws1) {
	if(state==1){
		ws1.send("ready for images");
	} else {
		ws1.send("not yet...");
	}
	ws1.on('close',function(){
		console.log('disconnected');
		for(var i=0;i<clients.length;i++){
			if(clients[i]==ws1){
				clients.splice(i, 1);
			}
		}
	});
    ws1.on('message', function(message) {
		
    });
});