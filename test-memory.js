
var mdb = require("./lib/markov-db.js").database();

function dump(w) {
	console.log(w.join(" ") + ".");
}

// console.log("loading cohen (synchronous)");
// mdb.loadPoetry(mdb.loadFile("example/cohen.txt"));

// console.log("loading dylan (synchronous)");
// mdb.loadPoetry(mdb.loadFile("example/dylan.txt"));

// console.log("loading rimbaud (synchronous)");
mdb.loadPoetry(mdb.loadFile("example/rimbaud.txt"));

console.log("generating (asynchronous)");
mdb.getStack(6,dump);
mdb.getStack(10,dump);
// mdb.getStack(12,dump);
// mdb.getStack(20,dump);
