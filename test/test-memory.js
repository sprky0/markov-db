var mdb = require("../index.js");
var db = mdb.getDatabase();

function dump(stack) {
	console.log(stack.join(" ") + ".");
}

mdb.log("loading rimbaud (synchronous)");
db.loadPoetry(mdb.loadFile("example/lorem.txt"));

mdb.log("generating (asynchronous)");

db.getStack(6,dump);
db.getStack(20,dump);
