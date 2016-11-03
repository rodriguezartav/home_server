var request = require("superagent");

var Log = function(){
}

Log.logs = [];

Log.store = function(message){
  Log.logs.push(message);
}

Log.set = function(logMessage){

  if (typeof logMessage === 'string' || logMessage instanceof String) logMessage = {text: logMessage};
  logMessage.time = Date.now();

  console.log( JSON.stringify( logMessage ) )

  request.post("http://localhost/log")
  .type('application/json')
  .send( JSON.stringify( logMessage ) )
  .end( function(err,res){
    if( res && res.text ) console.log( res.text )
    else console.log(err)
  })
}

Log.get = function(params){
  return Log.logs;
}

module.exports = Log;
