// libraries
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");

// that database
var db = new sqlite3.Database(':memory:');

var input = "Poe switched his focus to prose and spent the next several years working for literary journals and periodicals, becoming known for his own style of literary criticism. His work forced him to move among several cities, including Baltimore, Philadelphia, and New York City. In Baltimore in 1835, he married Virginia Clemm, his 13-year-old cousin. In January 1845 Poe published his poem, The Raven, to instant success. His wife died of tuberculosis two years after its publication. For years, he had been planning to produce his own journal, The Penn (later renamed The Stylus), though he died before it could be produced. On October 7, 1849, at age 40, Poe died in Baltimore; the cause of his death is unknown and has been variously attributed to alcohol, brain congestion, cholera, drugs, heart disease, rabies, suicide, tuberculosis, and other agents.";

function clean_up(text) {

	// remove parentheticals
	text = text.replace(/\(.*?\)/g,"");
	text = text.replace(/\[.*?\]/g,"");

	// remove commas, and semicolons
	text = text.replace(/[,;]/g,"");

	return text;
}

input = clean_up(input);

// split input
var sentences = input.split(".");

for (var i = 0; i < sentences.length; i++) {
	sentences[i] = sentences[i].trim().split(" ");
}

// get db and insert shit
db.serialize(function() {

	db.run("CREATE TABLE lorem (word TEXT, previous TEXT)");

	var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?)");

	for (var a = 0; a < sentences.length; a++) {
		for (var b = 0; b < sentences[a].length; b++) {
			var word = sentences[a][b].trim();
			var previous = "";
			if (b > 0) {
				previous = sentences[a][b - 1].trim();
			}
			if (word != "")
				stmt.run(word, previous);
		}
	}
	stmt.finalize();

	db.each("SELECT word, previous FROM lorem", function(err, row) {
		console.log(row.word + ": " + row.previous);
	});

});

db.close();
