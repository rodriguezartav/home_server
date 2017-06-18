var QSQL = require('q-sqlite3');
var DB = null;
var fs =require("fs");
var assets = require("./assets");

QSQL.createDatabase('./db/db').done(function(db) {

  DB = db;

  console.log("conected to db");
  var sql = fs.readFileSync("./db/" + process.argv[2] + ".sql").toString();
  console.log("Sql", sql);
  DB.run(sql).then(function(statement) {
    console.log("migration to db");
    console.log(statement);
  });

});

