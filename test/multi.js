var assert = require("assert");
var db = require("../index.js").getDatabase();

describe('', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){

			function dump(stack) {
				console.log(stack.join(" ") + ".");
			}

			mdb.log("loading lorem (synchronous)");
			db.loadProse(mdb.loadFile("example/lorem.txt"));

			mdb.log("generating (asynchronous)");

			db.getStack(Math.floor(Math.random() * 20),dump);

    })
  })
});
