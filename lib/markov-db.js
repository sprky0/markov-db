// libraries
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");

function database(db_name) {

	// create or open database, no param means memory
	var db = new sqlite3.Database(db_name || ':memory:');

	function loadFile(file) {
		return fs.readFileSync( file ) + "";
	}

	function removeNonAlphanumerics(text) {
		return text.replace(/\W/g, '');
	}

	function removeNonAlphanumericsOrSpaces(text) {
		return text.replace(/[^\w\s]/gi, '');
	}

	function collapseWhitespace(text) {
		return text.replace(/\s/,' ');
	}

	function clean(text) {
		return removeNonAlphanumericsOrSpaces(text);
	}

	function bruteForceClean(text) {

		// replace newlines with other newlines
		text = text.replace(/\r\n/g, "\n");

		// replace newlines with spaces
		text = text.replace(/\n/g, " ");

		// remove quotes
		text = text.replace('"', "");

		// remove parentheticals
		text = text.replace(/\(.*?\)/g, "");
		text = text.replace(/\[.*?\]/g, "");

		// remove commas, and semicolons
		text = text.replace(/[,;]/g, "");

		// standardize punctuation
		text = text.replace(/[!?]/g, ".");

		// remove double spaces
		text = text.replace("  ", " ");

		return text.toLowerCase();

	}

	function loadPoetry(text) {

		var input = clean(text);

		// split input
		var sentences = input.split(".");

		for (var i = 0; i < sentences.length; i++) {
			sentences[i] = sentences[i].trim().split(" ");
		}

		load(sentences);

	}

	function loadProse(text) {

		var input = clean(text);

		// split input
		var sentences = input.split(".");

		for (var i = 0; i < sentences.length; i++) {
			sentences[i] = sentences[i].trim().split(" ");
		}

		load(sentences);

	}

	function load(stack) {

		// get db and insert shit
		db.serialize(function() {

			var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?, ?)");

			for (var a = 0; a < stack.length; a++) {
				for (var b = 0; b < stack[a].length; b++) {
					var word = stack[a][b].trim();
					var previous = "";
					var next = "";
					if (b > 0) {
						previous = stack[a][b - 1].trim();
					}
					if (b < stack[a].length - 1) {
						next = stack[a][b + 1].trim();
					}
					if (word != "")
						stmt.run(word, previous, next);
				}
			}

			stmt.finalize();

		});

	}

	function getNext(current, callback) {

		db.each("SELECT current, previous, next FROM lorem WHERE previous = $1 ORDER BY RANDOM() LIMIT 1", {
			$1 : current
		}, function(err, row) {

			if (err) {
				console.log(err);
			}

			callback(row.current || null, row.next || null);

		});

	}

	function getStack(count, callback) {

		count = count || 20;
		var stack = [];

		function _next(current, next) {

			count--;
			stack.push(current);

			if (count > 0 || (count <= 0 && next)) {
				getNext(current,_next);
			} else {
				callback(stack);
			}

		}

		getNext("",_next);

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
		loadFile : loadFile,
		loadPoetry : loadPoetry,
		loadProse : loadProse,
		getStack : getStack,
		createTable : createTable,
		closeDatabase : closeDatabase
	};

}

exports.database = database;
