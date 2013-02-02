(function() {
    
    'use strict';

    /*jshint node:true */
    /*global */


    
    var express = require('express');


    
    var CFG = {
        port:            3000,
        dir:             '.',
        accessControlFn: function(collName, opName) { return true; }
    };



    var dumbdb_srv = function(cfg) {

        if (cfg) {
            if ('port'            in cfg) { CFG.port            = cfg.port; }
            if ('dir'             in cfg) { CFG.dir             = cfg.dir; }
            if ('accessControlFn' in cfg) { CFG.accessControlFn = cfg.accessControlFn; }
        }

        var colls = {};

        /*var fetchColl = function(coll, cb, res) {
            var c = colls[coll];

            if (!c) {
                return dumbdb.open(coll, true, function(err, c) {
                    if (err) { return res.send({status:'error', msg:'collection ' + coll + ' not found!'}); }
                    colls[coll] = c;
                    cb(null, c);
                });
            }

            cb(null, c);
        };*/


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

            res.send(coll + '.delete("' + id +'")');
        });

        app.get('/:coll/:id/:rev/download', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            res.send(coll + '.getBin("' + id +'", ' + rev + ')');
        });

        app.get('/:coll/:id/download', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.getBin("' + id +'")');
        });

        app.get('/:coll/:id/revisions', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.getRevisions("' + id +'")');
        });

        app.get('/:coll/:id/:rev', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            res.send(coll + '.get("' + id +'", ' + rev + ')');
        });

        app.get('/:coll/:id', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.get("' + id +'")');
        });

        app.get('/:coll', function(req, res) {
            var coll = req.params.coll;

            res.send(coll + '.all()');
        });

        app.get('/', function(req, res) {
            res.send({
                msg: 'Hello from dumbdb_srv!'
            });
        });


        // POSTS
        
        app.post('/:coll/:id/upload', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.setBin("' + id +'", postData)');
        });

        app.post('/:coll/upload', function(req, res) {
            var coll = req.params.coll;

            res.send(coll + '.createBin(postData)');
        });

        app.post('/:coll/:id', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            res.send(coll + '.set("' + id +'", postData)');
        });

        app.post('/:coll', function(req, res) {
            var coll = req.params.coll;

            res.send(coll + '.create(postData)');
        });
        



        app.listen( CFG.port );
        console.log('serving http dumbdb_srv server from port ' + CFG.port + '...');
    };



    module.exports = dumbdb_srv;
    
})();
