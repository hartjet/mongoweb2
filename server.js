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
var url = require('url');

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
var users;

var photoidGenerator = 100;
var tagidGenerator = 100;

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
			id: Number,
			name: String,
			description: String,
			user: [{
				type: String
			}],
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
			user: [{
				type: String
			}],
			id: Number
		},
		{collection: 'tags'}
	);
	Tags = mongoose.model('Tags', TagsSchema);
	var userSchema = new Schema(
		{
			username: String,
			password: String
		},
		{collection: 'users'}
	);
	users = mongoose.model('users', userSchema);
	var CounterSchema = new Schema(
		{
			_id: String,
			sequence_value: Number
		},
		{collection: 'counters'}
	);
	counters = mongoose.model('counters', CounterSchema);
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
function retrieveAllPhotos(res, query){
	var query = photos.find(query);
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

function retrieveAllTags(res, query){
	var query1 = Tags.find(query);
	query1.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

/*
function retrieveAllTags(res){
	var query = Tags.find({});
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}
*/
function getNextSequenceValue(photo){
	counters.findOneAndUpdate({
			"_id" : "productid"},
                {
                "$inc":{"sequence_value":1}
        }, {
                "new" : true,
                "upsert" : false
        }, function(err, counters) {
                if (err) {
                        console.log(err);
                } else {
                       
                }
				console.log("Sent "+counters.sequence_value);
				photo.id = counters.sequence_value;
				photos.create([photo], function(err){
					if(err){
						console.log('object creation failed');
					}
				});
        });
	/*console.log(sequenceName);
    var sequenceDocument = counters.findAndModify({query:{_id: "productid" },update: {$inc:{sequence_value:1}},new:true},
			function(){
				
	
	});*/
	//var idd = sequenceDocument.sequence_value;
	//console.log(idd);
}

function retrievePhotosByTag(res, query){
	console.log(query);
	var query = photos.find(query);
	query.exec(function(err, itemArr){
		res.json(itemArr);
	});
}

function retrievePhotosById(res, query){
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

function logInUsingDB(req, res, query){
	console.log("logging in....")
	var query = users.find(query);
	query.exec(function(err, itemArr){
		if (err) {
			console.log('failed to log in');
			console.log(err);
		} else {
			//console.log(itemArr);
			if(itemArr.length > 0){
				curSession = req.session
				curSession.username=itemArr[0].username;
				curSession.password=itemArr[0].password;
				//console.log(curSession);
				res.json(curSession.username);
			} else {
				console.log('Wrong U/P');
				res.json("");
			}
		}
	});
}


console.log("before defining app static route");
app.use('/', express.static('./public/'));
app.use('/app/json/', express.static('./app/json'));
app.use(session({secret: 'lolcat',saveUninitialized: true,resave: true}));

var curSession;

app.get('/app/photos/', function(req, res){
	console.log('Query all photos');
	curSession=req.session;
	retrieveAllPhotos(res, {user: curSession.username});
});

app.get('/app/photos/tags/:tag', function(req, res){
	var tag = req.params.tag;
	console.log('Query photos by tag');
	console.log(tag);
	curSession=req.session;
	retrievePhotosByTag(res, {tags: tag, user: curSession.username});
});

app.get('/app/photos/:tag/:photoId', function(req, res){
	var photoId = req.params.photoId;
	console.log('Quey photos by id');
	console.log(photoId);
	retrievePhotosById(res, {id: photoId});
});

app.get('/app/tags/', function(req, res){
	console.log('Query all tags');
	curSession=req.session;
	console.log(curSession);
	
	curSession.username='Jason';
	curSession.password='JSON';
	console.log(curSession);
	
	retrieveAllTags(res, {user: curSession.username});
});

/*
app.get('/app/tags/', function(req, res){
	console.log('Query all tags');
	retrieveAllTags(res);
});
*/
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
	getNextSequenceValue(jsonObj);
});

app.post('/app/photos/', jsonParser, function(req, res){
	console.log(req.body);
	var jsonObj = req.body;
	photos.create([jsonObj], function(err){
		if(err){
			console.log('object creation failed');
		}
	});
});

app.put('/app/photos/tags/', jsonParser, function(req, res) {
	console.log("req.body"+req.body);
	
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

/*app.put('/app/photos/defaultTag/', jsonParser, function(req, res) {
	console.log("req.body"+ req.body);
	console.log("req.body.id" + req.body.id);
	
	photos.update({"_id": mongoose.Types.ObjectId(req.body.id)},{$addToSet:{tags: "untagged"}}, function(err){
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
*/
app.post('/app/core/login/', jsonParser, function(req, res){
	console.log("logging in");
	var uname = req.body.username;
	var pword = req.body.password;
	logInUsingDB(req, res, {username: uname, password: pword});
});

app.get('/app/core/logout/', function(req,res){
	req.session.destroy(function(err){
		console.log("logging out");
		if(err){
			console.log(err);
		}
	});
});

app.get('/app/core/user/', function(req,res){
	curSession=req.session;
	console.log("sending "+curSession.username);
	res.send(curSession.username);
});

app.put('/app/deletephoto/', jsonParser, function(req, res){
	console.log('id: '+ req.body[0].id);
	photos.remove({id: req.body[0].id},function(err){
		if(err){
			console.log('object remove failed');
			console.log(err);
		}
	});
	console.log('I am a seperate line-------------');
	console.log(req.body);

});

app.put('/app/deletetag/', jsonParser, function(req, res){
	console.log('req: '+ req.body.id);
	console.log('req2: '+ req.body.tagName);
	photos.update({"id": req.body.id},{$pull:{"tags":req.body.tagName}},function(err){
		if(err){
			console.log('object update failed');
			console.log(err);
		}
	});
	console.log('tagggggg' + req.body.Tagarr);
	if(req.body.Tagarr.length == 1 || req.body.Tagarr.length == 0)
	{
		photos.update({"id": req.body.id},{$addToSet:{"tags":"untagged"}},function(err){
			if(err){
				console.log('object update failed');
				console.log(err);
			}
		});
	}
});

app.put('/app/deletedefaultTag/', jsonParser, function(req, res){
	console.log('reqqqqqq: '+ req.body.photoId);
	console.log('reqqqqqqq2: '+ req.body.tagName);
	photos.update({"id": req.body.photoId},{$pull:{"tags":req.body.tagName}},function(err){
		if(err){
			console.log('object update failed');
			console.log(err);
		}
	});
});


console.log("after defining all dynamic routes");


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});	
console.log("after calling http: createServer");