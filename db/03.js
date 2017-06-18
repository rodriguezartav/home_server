var QSQL = require('q-sqlite3');
var DB = null;
var fs =require("fs");
QSQL.createDatabase('./db/db').done(function(db) {

  DB = db;
  var assets = require("./assets");

  assets.assets.forEach( function(asset){


    DB.run('update assets set id = ? where id = ?','d073d510b7e3','d073d51310b4' ).then(function(statement) {
      console.log(statement);
    }).done();
  })

});
