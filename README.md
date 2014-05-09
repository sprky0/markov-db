markov-db
======

Generate new possible states based on input.  Reuse an existing SQLite database, or use a temporary database in memory.

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
