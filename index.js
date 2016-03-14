var express = require("express");
var app = express();
var router = express.Router();
var pg = require('pg');
var request = require('request');

var database_url = process.env.DATABASE_URL || "postgres://amcgill@localhost/trees"

// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});

// Set up static page (main page)
app.use("/", express.static(__dirname + "/redo/"));

// Set up static page (assets page)
app.use("/assets", express.static(__dirname + "/public/assets/"));



// Endpoint to deliver information about a tree
app.get("/api/trees/:id", function(request, response){
	
	pg.connect(database_url, function(err, client, done) {
		if( err ) throw err;
		client.query("SELECT ST_X(geom) as x, ST_Y(geom) as y, * FROM trees WHERE id = $1", [request.params.id], function(err, result){
			if( err )
				throw err;

			response.status(200).json(result.rows);

			done();
			client.end();
		});

	});
});

// Endpoint to get nearest cherry tree
app.get("/api/nearest/:lng/:lat", function(request, response){
	console.log(request.params.lng);
	
	pg.connect(database_url, function(err, client, done){
		if( err ) throw err;	
		console.log("connected to database");
		client.query("SELECT id, cmmn_nm, ST_X(geom) as x, ST_Y(geom) as y, ST_DISTANCE(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance \
			FROM trees \
			ORDER BY distance ASC LIMIT 10 ", 
		[request.params.lng, request.params.lat], function(err, result){
			if(err) throw err;
			response.status(200).json(result.rows);
			client.end();
		});
	});
	
})