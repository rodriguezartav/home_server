var rpiGPIO = require('rpi-gpio');
var async = require("async");
var q = require("q");
var Assets = require("./assets");

var PinsToAssetName={};

var GPIO = function(){
  var assets = [];
  Assets.instance.getByTypes(['fan','switch'])
  .then( function(rows){
    assets = assets.concat( rows );
    var individualPins = [];
    assets.forEach( function(asset){
      asset.id.split(",").forEach( function(pin){
        individualPins.push(pin);
        PinsToAssetName[pin] = asset.name;
      })
    })
    async.eachSeries(individualPins, GPIO.setupPin, GPIO._setupComplete);
  })
}

GPIO.prototype.handleChange = function(asset, originalAsset){
  if( asset.type == "fan" ) GPIO.writeForFan( asset.name, asset.status.speed );
  else if( asset.type == "pin" ) GPIO.write( asset.id, asset.status.on );
}

GPIO.writeForFan = function( fan, speed ){
  return Assets.instance.getByName(fan)
  .then( function(asset){
    var dualPins = asset.id.split(",");
    return GPIO.write(dualPins[0], true)
    .then( function(){
      return GPIO.write(dualPins[1], true)
    })
    .then( function(){
      var pin = GPIO._getPinFromSpeed( speed, dualPins );
      if( pin ){
        asset.status.on = true;
        asset.status.speed = speed;
        Assets.instance.save(asset);
        return GPIO.write(pin, false );
      }
      else{
        asset.status.on = false;
        asset.status.speed = 0;
        Assets.instance.save(asset);
        return true;
      }
    })
  })
}

GPIO.write = function( pin, status ){
  var name = PinsToAssetName[pin];
  console.log(PinsToAssetName, name)
  return Assets.instance.getByName(name)
  .then( function(asset){
    rpiGPIO.write( pin, status, function(err) {
      if (err) return defer.reject(err)
      asset.status.on = status == false;
      asset.status.initialized = true;
      Assets.instance.save(asset);
      return asset;
    });
  })

}

GPIO.setupPin = function(pin, callback){
  rpiGPIO.setup(pin, rpiGPIO.DIR_OUT, write);
  function write(setupError) {
    if( setupError ) return callback(setupError);
    rpiGPIO.write(pin, true, function(err) {
      if (err) callback(err);
      else callback( null );
    });
  }
}

GPIO._setupComplete = function(err){
  if(err) console.log(err);
  else{
    Assets.instance.getByTypes(['fan','switch'])
    .then( function(assets){
      assets.forEach( function(asset){
        asset.status.initialized = true;
        Assets.instance.save(asset);
      })
    })
  }
}

GPIO._getPinFromSpeed = function(speed, pins){
  if( speed == 1 ) return pins[1];
  else if( speed == 2 ) return pins[0];
  else return null;
}

GPIO._mapToArrayPins = function(fanMap){
  var keys = Object.keys(fanMap);
  var pins = [];
  keys.forEach( function(key){
    var arr = fanMap[key];
    arr.forEach( function(pin){ pins.push(pin); } );
  })
  return pins;
}

module.exports = GPIO;
