markov-db
======

Generate new possible states based on input.  Reuse an existing SQLite database, or use a temporary database in memory.  Many methods are asynchronous and make use of callbacks.

Methods
======

##getDatabase(database)

Return an instance of markov-db DAO.  If 'database' is omitted, a database will be created in memory.

```javascript
var mdb = require('markov-db');
var db = mdb.getDatabase();
```

##loadFile(filename)

Convenience method to load a text file from the filesystem as a string.

```javascript
var text = mdb.loadFile();
```

##setOptions(k,v)

Set global option **k** to value **v**.

##setOptions(object)

Set global options based on all properties and corresponding values in **object**.

```javascript
mdb.setOptions({
	verbose : true,
	wordToken : "\t"
});
```

##db.loadMulti(multi)

Import two-dimensional Array **multi** into the database.

```javascript
db.loadMulti([
	["the","dog","said","moo"],
	["cats","are","goofy","monkies"]
]);
```

##db.loadPoetry(text)

Load string **text** (which looks like poetry) into the database.

```javascript
var poem = "Roses are red\nViolets are blue\nThe earth is a cold, dead place";
db.loadPoetry(poem);
```

##db.loadProse(text)

Load string **text** (which looks like prose) into the database.  This method will attempt to isolate alphanumerics, separate sentences into sequences, and load these sequences into the database.

```javascript
var poem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
db.loadProse(poem);
```

##db.getStack(count,callback(stack))

Get a random sequence of length **count**.

```javascript
var db = mdb.getDatabase();
db.getStack(20, function(stack){
	console.log(stack.join(" "));
});
```

##db.getRandom(callback)

Load a random possible state, which will be supplied to **callback**.
Callback will be passed Strings representing new current state, next, previous.

##db.getNext(current, callback)

Load a possible state which could follow string **current**, which will be supplied to **callback**.
Callback will be passed Strings representing new current state, next, previous.

##db.getPrevious(current, callback(row.current, row.next, row.previous))

Load a possible state which could precede string **current**, which will be supplied to **callback**.
Callback will be passed Strings representing new current state, next, previous.

##db.closeDatabase()

Close the database.
