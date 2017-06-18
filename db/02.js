var QSQL = require('q-sqlite3');
var DB = null;
var fs =require("fs");
QSQL.createDatabase('./db/db').done(function(db) {

  DB = db;
  var assets = require("./assets");

  assets.assets.forEach( function(asset){

    DB.run('INSERT INTO assets (id,name,type,status) VALUES (?,?,?,?)', asset.id, asset.name, asset.type, JSON.stringify(asset.status) ).then(function(statement) {
      console.log(statement);
    }).done();
  })

});
