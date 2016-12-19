var rpiGPIO = require('rpi-gpio');
var async = require("async");
var q = require("q");

var Pins;

var GPIO = function(pins){
  var individualPins = GPIO._mapToArrayPins(pins);
  async.eachSeries(individualPins, GPIO.setupPin, GPIO._setupError);
  Pins = pins;
}

GPIO.writeForFan = function( fan, speed ){
  var dualPins = Pins[fan];
  return GPIO.write(dualPins[0], true)
  .then( function(){
    return GPIO.write(dualPins[1], true)
  })
  .then( function(){
    var pin = GPIO._getPinFromSpeed( speed, dualPins );
    if( pin ) return GPIO.write(pin, false );
    else return true;
  })
}


GPIO.write = function( pin, status ){
  console.log("setting " , pin, status);
  var defer = q.defer();
  rpiGPIO.write(pin, status, function(err) {
    if (err) defer.reject(err)
    else setTimeout( function(){ defer.resolve(); }, 500);
  });
  return defer.promise;
}

GPIO.setupPin = function(pin, callback){
  rpiGPIO.setup(pin, rpiGPIO.DIR_OUT, write);
  function write(setupError) {
    if( setupError ) return callback(setupError);
    console.log("setting " , pin, true);
    rpiGPIO.write(pin, true, function(err) {
      if (err) callback(err);
      else callback( null );
    });
  }
}

GPIO._setupError = function(err){
  if(err) console.log(err);
  else console.log("Fans Setup Complete");
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
