var Lights = require("./actions/lights");
var Fans = require("./actions/fans");

function Scenes(lx,bulbs, fans){
  var lights = new Lights(lx);
  new Fans(fans);
  Scenes._lx = lx;
  Scenes._bulbs = bulbs;
  Scenes._bulbLocations = {};
  Scenes._fans = fans;
  Object.keys(bulbs).forEach( function(key){
    var location = bulbs[key];
    Scenes._bulbLocations[location] = key;
  });
}

Scenes.off= function(){
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII","Cuarto_Lapas","Bano_Lapas", "Cuarto_Tortuga", "Bano_Tortuga"]);
  Lights.off( lights);
}

Scenes.on= function(){
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII","Cuarto_Lapas","Bano_Lapas", "Cuarto_Tortuga", "Bano_Tortuga"]);
  Lights.on( lights, "whiteNormal" );
}

Scenes.MainRoom_Lights_Off = function(){
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII","SalaII"]);
  Lights.off( lights);
  Fans.change( "sala", "OFF");
}

Scenes.MainRoom_Lights_Low = function(){
  var lights2 = makeBulbArray(["SalaII"]);
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII"]);
  Lights.on( lights, "lowWarm" );
  Lights.on( lights2, "purple" );

  Fans.change( "sala","SLOW" );

}

Scenes.MainRoom_Lights_Normal = function(){
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII","SalaII"]);
  Lights.on( lights, "whiteNormal" );

  Fans.change( "sala","FAST" );
}

Scenes.MainRoom_Lights_High = function(){
  var lights = makeBulbArray([ "SalaI", "CocinaI", "CocinaII", "CocinaIII","SalaII"]);
  Lights.on( lights, "highCold" );
}

Scenes.Lapas_Lights_Off = function(){
  var lights = makeBulbArray([ "Cuarto_Lapas", "Bano_Lapas"]);
  Lights.off(lights);
}

Scenes.Lapas_Lights_Low = function(){
  var lights = makeBulbArray([ "Cuarto_Lapas"]);
  Lights.on( lights, "lowWarm" );
}

Scenes.Lapas_Lights_High = function(){
  var lights = makeBulbArray([ "Cuarto_Lapas"]);
  Lights.on( lights, "highWarm" );
}

Scenes.Lapas_Bath_Lights_Timmer = null;
Scenes.Lapas_Bath_Lights_Timmed = function(){
  var lights = makeBulbArray([ "Bano_Lapas"]);
  Lights.on( lights, "highCold" );
  Scenes.Lapas_Bath_Lights_Timmer = setTimeout( function(){
    Scenes.Lapas_Bath_Lights_Timmer = null;
    Lights.off(lights);
  }, ( 1000 * 60 * 5 ) )
}

Scenes.Lapas_Bath_Lights_High = function(){
  clearTimeout(Scenes.Lapas_Bath_Lights_Timmer);
  var lights = makeBulbArray(["Bano_Lapas"]);
  Lights.on( lights, "highCold" );
}

Scenes.Lapas_Bath_Lights_Off = function(){
  var lights = makeBulbArray(["Bano_Lapas"]);
  Lights.off( lights);
}

Scenes.Tortuga_Lights_Off = function(){
  var lights = makeBulbArray([ "Cuarto_Tortuga", "Bano_Tortuga"]);
  Lights.off(lights);
}

Scenes.Tortuga_Lights_Low= function(){
  var lights = makeBulbArray([ "Cuarto_Tortuga"]);
  Lights.on( lights, "lowWarm" );
}

Scenes.Tortuga_Lights_High = function(){
  var lights = makeBulbArray([ "Cuarto_Tortuga"]);
  Lights.on( lights, "highWarm" );
}

Scenes._Tortuga_Bath_Lights_Timmer = null;
Scenes.Tortuga_Bath_Lights_Timmed = function(){
  var lights = makeBulbArray([ "Bano_Tortuga"]);
  Lights.on( lights, "highCold" );
  Scenes._Tortuga_Bath_Lights_Timmer = setTimeout( function(){
    Scenes._Tortuga_Bath_Lights_Timmer = null;
    Lights.off(lights);
  }, 1000 * 60 & 5 )
}

Scenes.Tortuga_Bath_Lights_High = function(){
  clearTimeout( Scenes._Tortuga_Bath_Lights_Timmer );
  var lights = makeBulbArray(["Bano_Tortuga"]);
  Lights.on( lights, "highCold" );
}

Scenes.Tortuga_Bath_Lights_Off = function(){
  var lights = makeBulbArray(["Bano_Tortuga"]);
  Lights.off( lights );
}

var makeBulbArray = function( locations ){
  var keys = [];
  locations.forEach( function(location){
    keys.push( Scenes._bulbLocations[location] );
  });
  return keys;
}

module.exports = Scenes;
