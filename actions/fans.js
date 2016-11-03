var gpio = require('rpi-gpio');
var Q= require("q");
var pins = [ 40,38,36,37,35,33];

var fans = {
  1: [pins[0],pins[1]],
  2: [pins[2],pins[3]],
  3: [pins[4],pins[5]],
}

var Fans = function(){
  var setups=[];
  //setup al pins
  pins.forEach( function(pin){
    setups.push( setup(pin) );
  });

  Q.all( setups )
  .then( function(){
    var offs = [];
    pins.forEach( function(pin){
      offs.push( off(pin) );
    })
    return Q.all( offs );
  })
  .done();
}

Fans.off = function(fanNumber){
  //turn off both pins
  var fan = fans[fanNumber];
  return off( fan[0] )
  .then( function(){
    return off(fan[1]);
  })

}

Fans.low = function( fanNumber ){
  //turn off both pins
  //turn on position 1
  var fan = fans[fanNumber];

  Fans.off( fanNumber )
  .then( function(){
    return on( fan[1] );
  })
}

Fans.high = function(fanNumber){
 //turn off both pins
 //turn on position 0
 var fan = fans[fanNumber];

 Fans.off( fanNumber )
 .then( function(){
   return on( fan[0] );
 })
}


function off(pin){
  var defer = Q.defer()
  gpio.write(pin, true, function(err) {
    if (err) defer.reject(err);
    else defer.resolve();
  });

  return defer.promise;
}

function on(pin){
  var defer = Q.defer()
  gpio.write(pin, false, function(err) {
    if (err) defer.reject(err);
    else defer.resolve();
  });

  return defer.promise;
}

function setup(pin){
  var defer = Q.defer()

  gpio.setup(pin, gpio.DIR_OUT, function(err){
    if (err) defer.reject(err);
    else defer.resolve();
  });

  return defer.promise;
}


