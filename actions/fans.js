var gpio = require('rpi-gpio');
var async = require("async");
var q = require("q");

function Fans(fans){
  Fans._fanMap = fans;
  Fans._pins = getFanPins( Fans._fanMap );
  console.log( Fans._pins );
  async.eachSeries(Fans._pins, setupPin, setupError);
}

Fans.change = function( fan, speed ){
  var pins = Fans._fanMap[fan];
  writePinPromise(pins[0], true)
  .then( function(){ return writePinPromise(pins[1], true) } )
  .then( function(){
    var pin = getPinFromSpeed( speed, pins );
    if( pin ) return writePinPromise(pin, false );
    else return true;
  })
}

function getPinFromSpeed(speed,pins){
  console.log(speed);
  if( speed == "SLOW" ) return pins[1];
  else if( speed == "FAST" ) return pins[0];
  else return null;
}

function writePinPromise( pin, status ){
  console.log("setting " , pin, status);

  var defer = q.defer();
  gpio.write(pin, status, function(err) {
      if (err) defer.reject(err)
      else{
        setTimeout( function(){ defer.resolve(); }, 500);
      }
  });
  return defer.promise;
}

function setupPin(pin, callback){
  gpio.setup(pin, gpio.DIR_OUT, write);
  function write(setupError) {
    if( setupError ) return callback(setupError);
      console.log("setting " , pin, true);

      gpio.write(pin, true, function(err) {
          if (err) callback(err);
          else callback( null );
      });
  }
}

function setupError(err){
  if(err) console.log(err);
  else console.log("Fans Setup Complete");
}

function getFanPins(fanMap){
  var keys = Object.keys(fanMap);
  var pins = [];
  keys.forEach( function(key){
    var arr = fanMap[key];
    arr.forEach( function(pin){ pins.push(pin); } );
  })
  return pins;
}

module.exports = Fans;
