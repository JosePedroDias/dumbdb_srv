var express = require('express');
var dumbdb = require('./dumbdb')();
var app = express();



app.use( express.bodyParser() );



var colls = {};

var fetchColl = function(coll, cb, res) {
	var c = colls[coll];

	if (!c) {
		return dumbdb.open(coll, function(err, c) {
			if (err) { return res.send({status:'error', msg:'collection ' + coll + ' not found!'}); }
			colls[coll] = c;
			cb(null, c);
		});
	}

	cb(null, c);
};



app.get('/:coll/:id', function(req, res) {
	var coll = req.params.coll;
	var id   = req.params.id;

	fetchColl(coll, function(err, c) {
		var o = c.get(id);
		if (!o) { return res.send({status:'error', msg:'item not found!'}); }
		res.send(o);
	}, res);
});

app.get('/:coll', function(req, res) {
	var coll = req.params.coll;

	fetchColl(coll, function(err, c) {
		res.send( c.all() );
	}, res);
});

app.get('/', function(req, res) {
	res.send({
		msg: 'hello from dumbdb'
	});
});


app.delete('/:coll/:id', function(req, res) {
	var coll = req.params.coll;
	var id   = req.params.id;

	fetchColl(coll, function(err, c) {
		var o = c.del(id);
		if (!o) { return res.send({status:'error', msg:'item not found!'}); }
		res.send({status:'ok'});
	}, res);
});


app.post('/:coll', function(req, res) {
	var coll = req.params.coll;

	if (!req.is('application/json')) {
		return dumbdb.create(coll, function(err, c) {
			if (err) { return res.send({status:'error', msg:err}); }
			colls[coll] = c;
			res.send({status:'ok', msg:'collection ' + coll + ' created.'});
		});
	}

	fetchColl(coll, function(err, c) {
		res.send( c.put(req.body) );
	}, res);
});



app.listen(3000);
