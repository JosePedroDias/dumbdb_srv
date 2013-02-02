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
		onSuccess: function(tmp, data) { cb(null, data); },
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
	AJ([ep, col, id], 'g', cb);
};

var get = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> get', col, id);
	AJ([ep, col, id], 'g', cb);
};

var create = function(col, o, cb) {
	if (!cb) { cb = CB; }
	console.log('-> create', col, o);
	AJ([ep, col], 'p', cb, o);
};

var set = function(col, o, cb) {
	if (!cb) { cb = CB; }
	console.log('-> set', col, o._id, o);
	AJ([ep, col, o._id], 'p', cb, o);
};

var del = function(col, id, cb) {
	if (!cb) { cb = CB; }
	console.log('-> delete', col, id);
	AJ([ep, col, id, 'delete'], 'g', cb);
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
