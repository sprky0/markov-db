var mdb = require("./index.js");
var db = mdb.getDatabase();

function dump(stack) {
	console.log(stack.join(" ") + ".");
}

// console.log("loading cohen (synchronous)");
// mdb.loadPoetry(mdb.loadFile("example/cohen.txt"));

// console.log("loading dylan (synchronous)");
// mdb.loadPoetry(mdb.loadFile("example/dylan.txt"));

mdb.log("loading rimbaud (synchronous)");
db.loadPoetry(mdb.loadFile("example/rimbaud.txt"));

mdb.log("generating (asynchronous)");

db.getStack(6,dump);
db.getStack(20,dump);
