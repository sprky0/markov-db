
var mdb = require("./lib/markov-db.js");
var dylan = mdb.loadFile("example/dylan.txt");
var cohen = mdb.loadFile("example/dylan.txt");

function dump(w) {
	console.log(w.join(" ") + ".");
}


// mdb.loadPoetry(dylan);
mdb.loadPoetry(cohen);

console.log("");
mdb.getStack(6,dump);
mdb.getStack(6,dump);
mdb.getStack(6,dump);
mdb.getStack(6,dump);
console.log("");

// mdb.getStack(10,dump);
// mdb.getStack(5,dump);
// mdb.getStack(2,dump);

