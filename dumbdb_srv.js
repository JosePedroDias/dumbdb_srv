(function() {
    
    'use strict';

    /*jshint node:true */
    /*global */


    
    var express = require('express');
    //var dumbdb  = require('dumbdb');
    var dumbdb  = require('../dumbdb/dumbdb');


    
    var CFG = {
        port:            3000,
        dir:             '.',
        accessControlFn: function(collName, opName) { return true; },
        verbose:         false
    };



    var dumbdb_srv = function(cfg) {

        if (cfg) {
            if ('port'            in cfg) { CFG.port            = cfg.port; }
            if ('dir'             in cfg) { CFG.dir             = cfg.dir; }
            if ('accessControlFn' in cfg) { CFG.accessControlFn = cfg.accessControlFn; }
        }

        var ddb = dumbdb({
            dir:     cfg.dir,
            verbose: true
        });

        var colls = {};

        var fetchColl = function(coll, cb, res) {
            var c = colls[coll];

            if (!c) {
                return ddb.open(coll, function(err, c) {
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
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            next();
        });


        // OPTIONS

        app.options('*', function(req, res, next) {
            res.send('');
        });


        // GETS

        app.get('/:coll/:id/delete', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.delete("' + id +'")'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.del(id) );
            }, res);
        });

        /*app.get('/:coll/:id/:rev/download', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            res.send(coll + '.getBin("' + id +'", ' + rev + ')');
        });

        app.get('/:coll/:id/download', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.getBin("' + id +'")');
        });*/

        app.get('/:coll/:id/revisions', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.getRevisions("' + id +'")'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.getRevisions(id) );
            }, res);
        });

        app.get('/:coll/:id/:rev', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            if (CFG.verbose) { console.log(coll + '.get("' + id +'", ' + rev + ')'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.get(id, rev) );
            }, res);
        });

        app.get('/:coll/:id', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.get("' + id +'")'); }

            fetchColl(coll, function(err, coll) {
                res.send( coll.get(id) );
            }, res);
        });

        app.get('/:coll', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.all()'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.all() );
            }, res);
        });

        app.get('/', function(req, res) {
            res.send({
                msg: 'Hello from dumbdb_srv!'
            });
        });


        // POSTS
        
        /*app.post('/:coll/:id/upload', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.setBin("' + id +'", postData)');
        });

        app.post('/:coll/upload', function(req, res) {
            var coll = req.params.coll;

            res.send(coll + '.createBin(postData)');
        });*/

        app.post('/:coll/:id', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.set("' + id +'", postData)'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.set(id, req.body) );
            }, res);
        });

        app.post('/:coll', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.create(postData)'); }
            
            fetchColl(coll, function(err, coll) {
                res.send( coll.create( req.body ) );
            }, res);
        });
        



        app.listen( CFG.port );
        console.log('serving http dumbdb_srv server from port ' + CFG.port + '...');
    };



    module.exports = dumbdb_srv;
    
})();
