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
            if ('verbose'         in cfg) { CFG.verbose         = cfg.verbose; }
        }

        var ddb = dumbdb({
            dir:     cfg.dir,
            verbose: true
        });

        var colls = {};

        // assumes cb is SYNCHRONOUS
        var fetch = function(coll, cb, res) {
            var c = colls[coll];

            var cb2 = function() {
                try {
                    var out = cb(null, c);
                    res.send(typeof out === 'number' ? ''+out : out); // WEIRD SHIT
                } catch (ex) {
                    console.log(ex);
                    res.send({status:'error', msg:ex.message});
                }
            };

            if (!c) {
                return ddb.open(coll, function(err, c2) {
                    if (err) { return res.send({status:'error', msg:'collection ' + coll + ' not found!'}); }
                    c = c2;
                    colls[coll] = c;
                    cb2();
                });
            }

            cb2();
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
        
        app.get('/:coll/clear', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.clear()'); }
            
            fetch(coll, function(err, coll) {
                return coll.clear();
            }, res);
        });

        app.get('/:coll/close', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.close()'); }
            
            fetch(coll, function(err, coll) {
                return coll.close();
            }, res);
        });

        app.get('/:coll/drop', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.drop()'); }
            
            fetch(coll, function(err, coll) {
                return coll.drop();
            }, res);
        });

        app.get('/:coll/:id/delete', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.delete("' + id +'")'); }
            
            fetch(coll, function(err, coll) {
                return coll.del(id);
            }, res);
        });

        app.get('/:coll/:id/restore', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.restore("' + id +'")'); }
            
            fetch(coll, function(err, coll) {
                return coll.restore(id);
            }, res);
        });

        app.get('/:coll/:id/:rev/restore', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            if (CFG.verbose) { console.log(coll + '.restore("' + id +'", ' + rev + ')'); }
            
            fetch(coll, function(err, coll) {
                return coll.restore(id, rev);
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
            
            fetch(coll, function(err, coll) {
                return coll.getRevisions(id);
            }, res);
        });

        app.get('/:coll/:id/revision_dates', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.getRevisionDates("' + id +'")'); }
            
            fetch(coll, function(err, coll) {
                return coll.getRevisionDates(id);
            }, res);
        });

        app.get('/:coll/:id/discard_revisions', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.discard_revisions("' + id +'")'); }
            
            fetch(coll, function(err, coll) {
                return coll.discardRevisions(id);
            }, res);
        });

        app.get('/:coll/:id/exists', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            if (CFG.verbose) { console.log(coll + '.exists("' + id +')'); }
            
            fetch(coll, function(err, coll) {
                return coll.exists(id);
            }, res);
        });

        app.get('/:coll/:id/:rev', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;
            var rev  = req.params.rev;

            if (CFG.verbose) { console.log(coll + '.get("' + id +'", ' + rev + ')'); }
            
            fetch(coll, function(err, coll) {
                return coll.get(id, rev);
            }, res);
        });

        app.get('/:coll/:id', function(req, res) {
            var coll = req.params.coll;
            var id   = req.params.id;

            if (CFG.verbose) { console.log(coll + '.get("' + id +'")'); }

            fetch(coll, function(err, coll) {
                return coll.get(id);
            }, res);
        });

        app.get('/:coll', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.all()'); }
            
            fetch(coll, function(err, coll) {
                return coll.all();
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

            if (CFG.verbose) { console.log(coll + '.set("' + id +'", ' + JSON.stringify(req.body) + ')'); }
            
            fetch(coll, function(err, coll) {
                //return coll.set(id, req.body);
                //
                var a = coll.set(id, req.body);
                console.log('GOT ' + a + '->' + typeof a);
                return a;
            }, res);
        });

        app.post('/:coll', function(req, res) {
            var coll = req.params.coll;

            if (CFG.verbose) { console.log(coll + '.create(' + JSON.stringify(req.body) + ')'); }
            
            fetch(coll, function(err, coll) {
                return coll.create( req.body );
            }, res);
        });
        



        app.listen( CFG.port );
        console.log('serving http dumbdb_srv server from port ' + CFG.port + '...');
    };



    module.exports = dumbdb_srv;
    
})();
