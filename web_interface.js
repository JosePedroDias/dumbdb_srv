var ep = 'http://127.0.0.1:3000';



var i = function(id) { return document.getElementById(id); };
var v = function(id, cast) {
	var val = i(id).value;
	if      (cast === 'f') { return parseFloat(val); }
	else if (cast === 'i') { return parseInt(val, 10); }
	else if (cast === 'b') { return val !== 'false' && val !== '0' && val !== ''; }
	return val;
};
var V = function(id, val) { i(id).value = val || ''; };
var s = function(parts) { return parts.join('/') + '/'; };



var Ajax = SAPO.Communication.Ajax;

var AJ = function(arrUri, method, cb, o) {
	var isPost = method === 'p';
	var opts = {
		cors:      true,
		method:    isPost ? 'POST' : 'GET',
		onSuccess: function(tmp, data) {
			if (data && data.status === 'error') {
				cb(data.msg);
			}
			else {
				cb(null, data);
			}
		},
		onFailure: cb
	};
	if (isPost) {
		opts.contentType = 'application/json; charset=utf-8';
		opts.postBody = JSON.stringify(o);
	}
	new Ajax( s(arrUri), opts);
};



var CB = function(err, data) {
	if (err) { return console.error(err); }
	console.log('<- ', data);
};


var exists = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> exists', col, id);
	AJ([ep, col, id, 'exists'], 'g', cb);
};

var get = function(col, id, rev, cb) {
	if (typeof rev !== 'number') { cb = rev; rev = undefined; }
	if (!cb) { cb = CB; }
	console.log('-> get', col, id);
	var args = [ep, col, id];
	if (rev) { args.push(rev); }
	AJ(args, 'g', cb);
};

var create = function(col, o, cb) {
	var id = v('id2');
	if (id) { o._id = id; }

	if (!cb) { cb = CB; }
	console.log('-> create', col, o);
	AJ([ep, col], 'p', function(err, res) {
		if (!err) {
			V('id2', res);
		}
		cb(err, res);
	}, o);
};

var sett = function(col, o, cb) {
	if (!cb) { cb = CB; }
	console.log('-> set', col, o._id, o);
	AJ([ep, col, o._id], 'p', function(err, res) {
		cb(err, parseInt(res, 10));
	}, o);
};

var del = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> delete', col, id);
	AJ([ep, col, id, 'delete'], 'g', cb);
};

var restore = function(col, id, rev, cb) {
	if (typeof rev !== 'number') { cb = rev; rev = undefined; }
	if (!cb) { cb = CB; }
	console.log('-> restore', col, id, rev);
	var args = [ep, col, id];
	if (rev) { args.push(rev); }
	args.push('restore');
	AJ(args, 'g', cb);
};

var getRevisions = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> getRevisions', col, id);
	AJ([ep, col, id, 'revisions'], 'g', cb);
};

var getRevisionDates = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> getRevisionDates', col, id);
	AJ([ep, col, id, 'revision_dates'], 'g', cb);
};

var discardRevisions = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> discardRevisions', col, id);
	AJ([ep, col, id, 'discard_revisions'], 'g', cb);
};

var clear = function(col, cb) {
	if (!cb) { cb = CB; }
	console.log('-> clear', col);
	AJ([ep, col, 'clear'], 'g', cb);
};

var close = function(col, cb) {
	if (!cb) { cb = CB; }
	console.log('-> close', col);
	AJ([ep, col, 'close'], 'g', cb);
};

var drop = function(col, cb) {
	if (!cb) { cb = CB; }
	console.log('-> drop', col);
	AJ([ep, col, 'drop'], 'g', cb);
};

var all = function(col, cb) {
	if (!cb) { cb = CB; }
	console.log('-> all', col);
	AJ([ep, col], 'g', cb);
};

var ping = function(cb) {
	if (!cb) { cb = CB; }
	console.log('-> ping');
	AJ([ep], 'g', cb);
};
