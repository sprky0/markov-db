var mdb = require("../index.js");
var db = mdb.getDatabase();

function dump(stack) {
	console.log(stack.join(" ") + ".");
}

// mdb.setOption("verbose",true);

mdb.log("loading lorem (synchronous)");
db.loadProse(mdb.loadFile("example/lorem.txt"));

mdb.log("generating (asynchronous)");
db.getStack(Math.floor(Math.random() * 20),dump);
