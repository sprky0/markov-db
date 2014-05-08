var mdb = require("./index.js");
var db = mdb.getDatabase();

function dump(stack) {
	console.log(stack.join(" ") + ".");
}

// mdb.setOption("verbose",true);

console.log("loading lorem (synchronous)");
db.loadProse(mdb.loadFile("example/lorem.txt"));

console.log("generating (asynchronous)");
db.getStack(6,dump);
db.getStack(10,dump);
