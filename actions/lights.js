Colors = {
 "default": [50, 60, 100,4000],
 "lowWarm": [50, 60, 50,3000],
 "whiteNormal": [50, 60, 100,6000],
 "highWarm": [50, 60, 100,7000],
 "highCold": [50, 60, 100,7000],
}

function Lights(lx){
  Lights.lx = lx;
}

Lights.on = function( lights, namedColor ){
  var params = Colors.default;
  if( Colors[namedColor] ) params = Colors[namedColor];

  lights.forEach( function(lightId){
    Lights.lx.light(lightId).on();
    console.log(params);
    Lights.lx.light(lightId).color( params[0],params[1],params[2],params[3] );
  })
}

Lights.off = function(lights){
  lights.forEach( function(lightId){
    console.log(lightId, Lights.lx, Lights.lx.light(lightId));

    Lights.lx.light(lightId).off();
  })
}

module.exports = Lights;
