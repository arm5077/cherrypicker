require('dotenv').config()

var express = require("express");
var app = express();
var router = express.Router();

var pg = require('pg'),
  moment = require('moment'),
  request = require('request');

var database_url = process.env.DATABASE_URL || "postgres://amcgill@localhost/trees"

// Make Postgres client
var pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  idleTimeoutMillis: 1000,
  ssl: true
})

// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});

// Set up static page (main page)
app.use("/", express.static(__dirname + "/public/"));

// Set up static page (assets page)
app.use("/assets", express.static(__dirname + "/public/assets/"));

// Set up cert challenge page
app.use("/.well-known/acme-challenge/", express.static(__dirname + "/ssl/"));

// Endpoint to deliver information about a tree
app.get("/api/trees/:id", function(request, response){
	pool.query("SELECT ST_X(geom) as x, ST_Y(geom) as y, * FROM trees WHERE id = $1", [request.params.id], function(err, result){
		if( err )
			throw err;
		response.status(200).json(result.rows);
	});
});

// Endpoint to get nearest cherry tree
app.get("/api/nearest/:lng/:lat", function(request, response){  
	pool.query(`SELECT id, cmmn_nm, ST_X(geom) as x, ST_Y(geom) as y, ST_DISTANCE(geom, ST_SetSRID(ST_MakePoint(${request.params.lng}, ${request.params.lat}), 4326)) as distance 
		FROM trees 
    ORDER BY distance ASC LIMIT 10 `, 
  function(err, result){
		if(err) throw err;
		// This keeps breaking, figure out why, but here's a temporary fix
		pool.query("GRANT ALL PRIVILEGES ON TABLE latlngs TO mprydeiogvbioz", function(err){
			if(err) throw err;
			pool.query("INSERT INTO latlngs (lat, lng, timestamp) VALUES (" + request.params.lat + ", " + request.params.lng + ",'" + moment().format('YYYY-MM-DD HH:mm:ss') + "')", function(err){
				if(err) throw err;
				response.status(200).json(result.rows);
			});		
		});			
	});
})

// Endpoint to get random rows
app.get("/api/random", function(request, response){	
	pool.query("select id, cmmn_nm, ST_X(geom) as x, ST_Y(geom) as y from trees where random() < 0.01 limit 100;", function(err, result){
		if(err) throw err;
		response.status(200).json(result.rows);
	});
})