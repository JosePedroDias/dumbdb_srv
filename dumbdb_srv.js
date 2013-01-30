var express = require('express');

//var dumbdb = require('../dumbdb/dumbdb')({
var dumbdb = require('dumbdb')({
    rootDir: __dirname,
    verbose: true
});


/*jshint node:true */
/*global */



var CFG = {
    port: 3000
};



var dumbdb_srv = function(cfg) {

    'use strict';


    if (cfg) {
        if ('port' in cfg) { CFG.port = cfg.port; }
    }

    var colls = {};

    var fetchColl = function(coll, cb, res) {
        var c = colls[coll];

        if (!c) {
            return dumbdb.open(coll, true, function(err, c) {
                if (err) { return res.send({status:'error', msg:'collection ' + coll + ' not found!'}); }
                colls[coll] = c;
                cb(null, c);
            });
        }

        cb(null, c);
    };


    // -----------------
    
    
    var app = express();


    app.use( express.bodyParser() );


    // CORS
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });


    app.get('/:coll/:id', function(req, res) {
        var coll = req.params.coll;
        var id   = req.params.id;

        fetchColl(coll, function(err, c) {
            var o = c.get(id);
            if (!o) { return res.send({status:'error', msg:'item not found!'}); }

            if ('_contentType' in o) {
                res.set('Content-Type', o._contentType);
            }
            
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


    app['delete']('/:coll/:id', function(req, res) {
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
            return dumbdb.create(coll, true, function(err, c) {
                if (err) { return res.send({status:'error', msg:err}); }
                colls[coll] = c;
                res.send({status:'ok', msg:'collection ' + coll + ' created.'});
            });
        }

        fetchColl(coll, function(err, c) {
            res.send( c.put(req.body) );
        }, res);
    });



    app.listen( CFG.port );
};



module.exports = dumbdb_srv;
