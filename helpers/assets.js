var QSQL = require('q-sqlite3');

function Assets(db){
  var _this = this;
  this.db = db;
  Assets.instance = this;
}

Assets.prototype.getByType = function(type){
  console.log("get by type");
  return this.db.all('SELECT id,name, type,status FROM assets WHERE type = ?',type)
  .then( function(rows){
    rows.forEach( function(row){
      if( !row.status ) row.status = '{"on": false, "initialized": false}';
      row.status = JSON.parse(row.status);
    });
    return rows;
  })
}

Assets.prototype.getByTypes = function(types){
  console.log("get by types");
  return this.db.all("SELECT id,name, type,status FROM assets WHERE type IN ('" + types[0] + "','" + types[1] + "')" )
  .then( function(rows){
    rows.forEach( function(row){
      if( !row.status ) row.status = '{"on": false, "initialized": false}';
      row.status = JSON.parse(row.status)
    });
    return rows;
  })
}

Assets.prototype.getById = function(id){
  console.log("get by id");
  return this.db.all('SELECT id,name, type,status FROM assets WHERE id = ?',id)
  .then( function(rows){
    rows.forEach( function(row){
      if( !row.status ) row.status = '{"on": false, "initialized": false}';
      row.status = JSON.parse(row.status)
    });
    console.log(rows);
    return rows[0];
  })
}

Assets.prototype.getByIdFromNames = function(names){
  console.log("get by id for name");
  var namesList = "('";
  names.forEach( function(name){
    namesList += name + "','";
  })
  namesList = namesList.substring(0, namesList.length-2);
  namesList += ")";
  var query = 'SELECT id,name, type,status FROM assets WHERE name IN ' + namesList;
  console.log(query);

  return this.db.all(query)
  .then( function(rows){
    var ids = [];
    rows.forEach( function(asset){
      if( !asset.status ) asset.status = '{"on": false, "initialized": false}';
      asset.status = JSON.parse( asset.status);
      for( index in names ){
        var name = names[index];
        if( asset.name == name ){
          ids.push( asset.id )
        }
      }
    });
    if( ids.length != names.length ) throw new Error("Could not find all ids");
    return ids;
  })
}

Assets.prototype.getByName = function(name){
  if( !name ) throw new Error("Name must be set");
  console.log("get by name", name);
  return this.db.all('SELECT id,name, type,status FROM assets WHERE name = ?',name)
  .then( function(rows){
    if( !rows || rows.length == 0 ) throw new Error("Asset with name " + name + " not found");
    rows.forEach( function(row){
      if( !row.status ) row.status = '{"on": false, "initialized": false}';
      row.status = JSON.parse( row.status);
    });
    return rows[0];
  })
}

Assets.prototype.getAll = function(){
  console.log("get all");
  return this.db.all('SELECT id,name, type,status FROM assets')
  .then( function(rows){
    rows.forEach( function(row){
      if( !row.status ) row.status = '{"on": false, "initialized": false}';
      row.status = JSON.parse(row.status);
    });
    return rows;
  });
}

Assets.prototype.create = function(id, name, type){
  console.log("create");
  var status = {on: false, initialized: false};
  return this.db.run('INSERT INTO assets (id,name,type,status) VALUES (?,?,?,?)', id,name,type,JSON.stringify(status));
}

Assets.prototype.save = function(asset){
  console.log("save", asset);
  this.db.run('update assets set status = ? where id = ?', JSON.stringify(asset.status), asset.id)
}

Assets.prototype.changeStatus = function(id, status){
  console.log("change status", id, status);
  var _this = this;
  return this.db.all('SELECT id,name, type,status FROM assets WHERE id = ?',id)
  .then( function(rows){
    var row = rows[0];
    return _this.db.run( "update assets set status = ? where id = ?", JSON.stringify(status), id )
  })
}

module.exports = Assets;
