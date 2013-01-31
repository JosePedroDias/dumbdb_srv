var ep = 'http://127.0.0.1:3000';



var i = function(id) { return document.getElementById(id); };
var s = function(parts) { return parts.join('/'); };



var exists = function(col, id) {
	$.ajax( s([ep, col, id]), {
		type: 'GET',
		success: function(data) {
			console.log(data);
		}
	});
};

var get = function(col, id) {
	$.ajax( s([ep, col, id]), {
		type: 'GET',
		success: function(data) {
			console.log(data);
		}
	});
};

var put = function(col, o) {
	$.ajax( s([ep, col]), {
		type: 'POST',
		data: o,
		dataType: 'application/json',
		success: function(data) {
			console.log(data);
		}
	});
};

var delet = function(col, id) {
	$.ajax( s([ep, col, id]), {
		type: 'DELETE',
		success: function(data) {
			console.log(data);
		}
	});
};

var ping = function() {
	$.ajax(ep, {
		type: 'POST',
		data: o,
		success: function(data) {
			console.log(data);
		}
	});
};

var all = function(col) {
	$.ajax( s([ep, col]), {
		type: 'GET',
		success: function(data) {
			console.log(data);
		}
	});
};
