/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require("http");
var uriUtil = require("mongodb-uri");
var util = require('util');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

//put config url behind file to hide passwords and username
var mongoDBConnection = require('./db.photoApp.config');
console.log("mongodb URI: " + mongoDBConnection.uri);

var mongooseUri = uriUtil.formatMongoose(mongoDBConnection.uri);
console.log("mongooseDB URI:" + mongooseUri);

var app = express();
app.set('port', process.env.PORT || 3000); //3000 8080);
app.use(morgan('combined'));
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
app.use(methodOverride());

/*
app.use(session({ 
		secret: 'keyboard cat',
		store: new MongoStore({ 
			url: 'mongodb://dbAdmin/test@localhost:3000/toDoSample',
			collection: 'sessions'})
}));
*/
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var photos;
var tags;

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } }; 
mongoose.connect(mongooseUri, options);

app.use(session({ 
		secret: 'keyboard cat',
		store: new MongoStore({ 
			mongooseConnection: mongoose.connection,
			collection: 'sessions'
		})
}));

console.log('Sending connecting request with Mongo db');
mongoose.connection.on('error', function() {
	console.log("problems connecting to the MongoDB server");
});
mongoose.connection.on('open', function() {
	console.log("After connecting to Mongo");
	var Schema = mongoose.Schema;
	var PhotosSchema = new Schema(
		{
			name: String,
			description: String,
			location: String,
			tags: [{
				type: String
			}]
		},
		{collection: 'photos'}
	);
	photos = mongoose.model('photos', PhotosSchema);
	var TagsSchema = new Schema(
		{
			name: String,
			id: Number
		},
		{collection: 'tags'}
	);
	Tags = mongoose.model('Tags', TagsSchema);
	console.log('models have been created');
});

function displayDBError(err){
	if (err) { 
		console.log("error 1: " + err);
		for (p in err) {
			console.log(p + ":" + err[p]);
		}
	}
	else {
		console.log("no errors querying the db");
	}
}

console.log("before creating query functions");
function retrieveAllPhotos(res){
	var query = photos.find({});
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

function retrieveAllTags(res){
	var query = Tags.find({});
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

function retrievePhotosByTag(res, query){
	console.log(query);
	var query = photos.find(query);
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

function updatePhotoTag(res, query){
	console.log(query);
	var query = photos.update({name:query.name},{$addToSet:{tags:query.tags}})
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}


console.log("before defining app static route");
app.use('/', express.static('./public'));
app.use('/app/json/', express.static('./app/json'));

app.get('/app/photos/', function(req, res){
	console.log('Query all photos');
	retrieveAllPhotos(res);
});

app.get('/app/photos/tags/:tag', function(req, res){
	var tag = req.params.tag;
	console.log('Query photos by tag');
	console.log(tag);
	retrievePhotosByTag(res, {tags: tag});
});

app.get('/app/tags/', function(req, res){
	console.log('Query all tags');
	retrieveAllTags(res);
});

app.post('/app/tags/', jsonParser, function(req, res) {
	console.log(req.body);
	var jsonObj = req.body;
	jsonObj.id = tagidGenerator;
	Tags.create([jsonObj], function (err) {
		if (err) {
			console.log('object creation failed');
		}
	});
	res.send(tagidGenerator.toString());
	tagidGenerator++;
});

app.post('/app/addphotos/', jsonParser, function(req, res){
	console.log(req.body);
	var jsonObj = req.body;
	photos.create([jsonObj], function(err){
		if(err){
			console.log('object creation failed');
		}
	});
});

app.put('/app/photos/tags/', jsonParser, function(req, res) {
	console.log(req.body);
	
	photos.update({"_id": mongoose.Types.ObjectId(req.body.id)},{$addToSet:{tags: {$each: req.body.tags}}}, function(err){
		if(err){
			console.log('object update failed');
			console.log(err);
		}
	});
	
	//db.photos.update({"_id": ObjectId("555e5722e62133366a9f8e31")},{$addToSet:{tags: {$each: ["washington", "france"]}}})
	//var tag = req.params.tag;
	//console.log('Query photos by tag');
	//console.log(tag);
	//retrievePhotosByTag(res, {tags: tag});
});


console.log("after defining all dynamic routes");


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});	
console.log("after calling http: createServer");