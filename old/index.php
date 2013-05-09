<?php

$curl = curl_init("http://api.4chan.org/b/catalog.json");
curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($curl);
curl_close($curl);
$result = json_decode($result);
$pages = count($result);
$image_threads = array();
for($i=0; $i<$pages; $i++){
	for($j=0; $j<count($result[$i]->threads); $j++){
		$threads = $result[$i]->threads;
/* 		print_r($threads[$j]); */
		if($threads[$j]->images > 20){
			array_push($image_threads, $threads[$j]);
		}
	}
}
$rand_1 = rand(0, count($image_threads));
$rand_2 = rand(0, count($image_threads));
$player_1 = $image_threads[$rand_1]->no;
$player_2 = $image_threads[$rand_2]->no;

sleep(1);
?>

<!DOCTYPE html>
<html>
<head>
	<title>ws client</title>
	<meta name="generator" content="TextMate http://macromates.com/">
	<meta name="author" content="Joseph Moore">
	<meta charset="utf-8">
	<!-- Date: 2013-04-30 -->
	<link rel="stylesheet" href="css/styles.css" type="text/css" media="all" />
	<!-- Mobile viewport optimized: h5bp.com/viewport -->
  	<meta name="viewport" content="width=device-width">
	<!--[if lt IE 9]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
</head>
<body>
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lte IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

<div id="wrapper">
	<form id="twitter-word-form">
		<label for="twitter-word">Enter word:</label>
		<input id="twitter-word" type="text" value="" />
		<input id="submit-tweet" type="submit" value="Go." />
	</form>
	<div id="tweet"></div>
	<div id="status"></div>
</div>

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
	<script>
		jQuery(document).ready(function($){
			$.ajax({
				url:"http://api.4chan.org/b/catalog.json",
				success: function(data){
								var thread1 = "http://api.4chan.org/b/res/<?=$player_1?>.json";
			var thread2 = "http://api.4chan.org/b/res/<?=$player_2?>.json";
			var state = 0;
			var ws = new WebSocket('ws://localhost:8080');
			ws.onopen = function() {
				$('#twitter-word-form').submit(function(){
					ws.send($('#twitter-word').val());
					return false;
				});
			};
			ws.onmessage = function(data, flags) {
				if(state==0){
					$('#tweet').html('<span class="tweet-user">@' + JSON.parse(data.data).from_user + '</span><span class="tweet-time">' + JSON.parse(data.data).created_at + '</span><p class="tweet-text">' + JSON.parse(data.data).text + '</p>');
					state++;
				} else if (state == 1){
					if(data.data=="waiting"){
						waitForimages();
					}
				}
			};
				}
			});
			
			function waitForimages(){
				$('#status').html("WAITING FOR IMAGES FROM PLAYERS.");
			}
		});

	</script>
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
  <!-- Asynchronous Google Analytics snippet. Change UA-XXXXX-X to be your site's ID.
       mathiasbynens.be/notes/async-analytics-snippet -->
  <script>
    var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g,s)}(document,'script'));
  </script>
</body>
</html>