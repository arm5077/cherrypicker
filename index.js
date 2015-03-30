var express = require("express");
var app = express();
var router = express.Router();
var pg = require('pg');

// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});

// Endpoint to deliver information about a tree
app.get("/trees/:id", function(request, response){
	
	pg.connect("postgres://amcgill@localhost/trees", function(err, client, done) {
		if( err ) throw err;
		client.query("SELECT * FROM trees.trees WHERE id = $1", [request.params.id], function(err, result){
			if( err )
				throw err;

			response.status(200).json(result.rows);

			done();
			client.end();
		});

	});
});

// Endpoint to get nearest cherry tree
app.get("/nearest/:lng/:lat", function(request, response){
	console.log(request.params.lng);
	
	pg.connect("postgres://amcgill@localhost/trees", function(err, client, done){
		if( err ) throw err;	
		client.query("SELECT *, ST_DISTANCE(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance \
			FROM trees.trees \
			WHERE common_name LIKE '% cherry%' \
			ORDER BY distance ASC LIMIT 5 ", 
		[request.params.lng, request.params.lat], function(err, result){
			if(err) throw err;
			response.status(200).json(result.rows);
		});
	});
	
})



//SELECT *, ST_DISTANCE(geom, ST_SetSRID(ST_MakePoint(-77.054505, 38.935440), 4326)) as distance FROM trees.trees WHERE common_name LIKE '%cherry%' ORDER BY distance ASC LIMIT 5 