// libraries
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");

var options = {
	requireEndedness : false,
	wordToken : " ",
	sentenceToken : new RegExp(/!\.\?/g),
	verbose : false
};

/**
* convenience method to load a file on disk into memory as a string
*/
function loadFile(filename) {
	return fs.readFileSync( filename ) + "";
}

/**
 * Output log entries if we are in verbose mode
 */
function log() {
	if (console && options.verbose) {
		console.log.apply(console, arguments);
	}
}

function setOption() {
	if (arguments.length == 2) {
		log("Setting " + arguments[0], arguments[1]);
		options[arguments[0]] = arguments[1];
	} else if (arguments.length == 1) {
		for(var i in arguments[0]) {
			log("Setting " + i, arguments[0][i]);
			options[i] = arguments[0][i];
		}
	}
}

/**
 * remove non alpha-nums from a string
 */
function removeNonAlphanumerics(text) {
	return text.replace(/\W/g, '');
}

/**
 * collapse white space into a single space character
 */
function collapseWhitespace(text) {
	return text.replace(/\s/,' ');
}

/**
 * perform basic cleanup on 'text' assuming roman characters, numeric values, punctuation
 */
function clean(text) {
	return text
		.replace(/[^A-Za-z0-9 _.,!?"'/$]/g," ")
		.replace(/\s/g," ");
}

/**
 * get a markov DB instance for database name, or pass nothing to use a db in memory
 */
function getDatabase(db_name) {

	// create or open database, no param means memory
	var db = new sqlite3.Database(db_name || ':memory:');

	function loadPoetry(text) {

		var input = clean(text);

		// split input
		var sentences = input.split(options.sentenceToken);

		for (var i = 0; i < sentences.length; i++) {
			sentences[i] = sentences[i].trim().split(options.wordToken);
		}

		loadMulti(sentences);

	}

	function loadProse(text) {

		var input = clean(text);

		// split input
		var sentences = input.split(options.sentenceToken);

		for (var i = 0; i < sentences.length; i++) {
			sentences[i] = sentences[i].trim().split(options.wordToken);
		}

		loadMulti(sentences);

	}

	function load(stack) {

		db.serialize(function() {

			var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?, ?)");

			for (var a = 0; a < stack[a].length; a++) {
				var word = stack[a].trim();
				var previous = "";
				var next = "";
				if (a > 0) {
					previous = stack[a - 1].trim();
				}
				if (a < stack.length - 1) {
					next = stack[a + 1].trim();
				}
				if (word != "")
					stmt.run(word, previous, next);
			}

			stmt.finalize();

		});

	}

	function loadMulti(multi) {

		db.serialize(function() {

			var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?, ?)");

			for (var a = 0; a < multi.length; a++) {
				for (var b = 0; b < multi[a].length; b++) {
					var word = multi[a][b].trim();
					var previous = "";
					var next = "";
					if (b > 0) {
						previous = multi[a][b - 1].trim();
					}
					if (b < multi[a].length - 1) {
						next = multi[a][b + 1].trim();
					}
					if (word != "")
						stmt.run(word, previous, next);
				}
			}

			stmt.finalize();

		});

	}

	function getRandom(callback) {

		db.each("SELECT current, previous, next FROM lorem WHERE next <> $1 ORDER BY RANDOM() LIMIT 1", {
			$1 : ""
		}, function(err, row) {

			if (err) {
				log(err);
			}

			callback(row.current, row.next, row.previous);

		});

	}

	function getNext(current, callback) {

		db.each("SELECT current, previous, next FROM lorem WHERE previous = $1 ORDER BY RANDOM() LIMIT 1", {
			$1 : current
		}, function(err, row) {

			if (err) {
				console.log(err);
			}

			callback(row.current, row.next, row.previous);

		});

	}

	function getPrevious(current, callback) {

		db.each("SELECT current, previous, next FROM lorem WHERE next = $1 ORDER BY RANDOM() LIMIT 1", {
			$1 : current
		}, function(err, row) {

			if (err) {
				console.log(err);
			}

			callback(row.current, row.previous, row.next);

		});

	}

	function getStack(count, callback) {

		count = count || 20;
		var stack = [];

		function _next(current, next, previous) {

			count--;
			stack.push(current);

			if (count > 0 || (options.requireEndedness && count <= 0 && next)) {
				getNext(current,_next);
			} else {
				callback(stack);
			}

		}

		getRandom(_next);

	}

	function getStackFromStart(start, count, callback) {

		count = count || 20;
		var stack = [start];

		function _next(current, next, previous) {

			count--;
			stack.push(current);

			if (count > 0 || (options.requireEndedness && count <= 0 && next)) {
				getNext(current,_next);
			} else {
				callback(stack);
			}

		}

		getNext(start,_next);

	}

	function getStackFromEnd(end, count, callback) {

		count = count || 20;
		var stack = [];

		function _next(current, next, previous) {

			count--;
			stack.push(current);

			if (count > 0 || (options.requireEndedness && count <= 0 && next)) {
				getNext(current,_next);
			} else {
				callback(stack);
			}

		}

		getRandom(_next);

	}

	function createTable() {
		db.run("CREATE TABLE IF NOT EXISTS lorem (current TEXT, previous TEXT, next TEXT)");
	}

	function closeDatabase() {
		db.close();
	}

	// create the table if she no exist
	createTable();

	return {

		// public load methods
		load : load,
		loadMulti : loadMulti,
		loadPoetry : loadPoetry,
		loadProse : loadProse,

		// public stack methods
		getStack : getStack,
		getStackFromEnd : getStackFromEnd,
		getStackFromStart : getStackFromStart,

		// public state traversal methods
		getRandom : getRandom,
		getNext : getNext,
		getPrevious : getPrevious,

		// db methods
		closeDatabase : closeDatabase
	};

}

exports.log = log;
exports.setOption = setOption;
exports.getDatabase = getDatabase;
exports.loadFile = loadFile;
