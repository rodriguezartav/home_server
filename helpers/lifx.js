var LifxClient = require('node-lifx').Client;

var BulbLocations = {}

function Lifx(Bulbs, Colors){
  Lifx.Bulbs = Bulbs;
  Lifx.Colors = Colors;

  Lifx.client = new LifxClient();

  Lifx.client.on('light-new', function(light) {
    console.log("Light:", Lifx.Bulbs[light.id], light.address, light.label || light.name, light.status);
  });

  Lifx.client.init();

  Object.keys(Lifx.Bulbs).forEach( function(key){
    var location = Lifx.Bulbs[key];
    BulbLocations[location] = key;
  });


}

Lifx.on = function( namedLights, namedColor ){
  var params = Lifx.Colors.default;
  if( Lifx.Colors[namedColor] ) params = Lifx.Colors[namedColor];

  var lights = Lifx.makeBulbArray(namedLights);

  lights.forEach( function(lightId){
    var bulb = Lifx.client.light(lightId);
    if( bulb ) bulb.on();
    if(bulb) bulb.color( params[0],params[1],params[2],params[3] );
  })
}

Lifx.off = function(namedLights){
  var lights = Lifx.makeBulbArray(namedLights);

  lights.forEach( function(lightId){
    var bulb = Lifx.client.light(lightId);
    if(bulb) bulb.off();
  })
}

Lifx.makeBulbArray = function( locations ){
  var keys = [];
  locations.forEach( function(location){
    keys.push( BulbLocations[location] );
  });
  return keys;
}

module.exports = Lifx;
