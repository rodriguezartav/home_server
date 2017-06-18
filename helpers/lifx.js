var LifxClient = require('node-lifx').Client;
var Assets = require("./assets");

function Lifx(Bulbs, Colors){
  var _this = this;
  Lifx.Colors = Colors;

  Lifx.client = new LifxClient();

  Lifx.initTimeout;

  Lifx.client.on('light-offline', function(lightBulb) {
    _this.onLightOffline(lightBulb);
  })

  Lifx.client.on('light-new', function(lightBulb) {
    _this.onLightNew(lightBulb);
  });

  Lifx.client.on('light-online', function(lightBulb) {
    _this.onLightNew(lightBulb);
  })

  setTimeout(function(){
    Assets.instance.getByType('light')
    .then( function(assets){
      names = assets.map(function(asset){
        return asset.name;
      })
      Lifx.off( names );
    }).done();
  },3000);

  Lifx.client.init()
}

Lifx.prototype.onLightNew = function(lightBulb){
  Assets.instance.getById(lightBulb.id)
  .then( function(light){
    if( !light ) return;
    lightBulb.getState( function(err,state){
      if(err) return;
      light.status.on = state.power > 0;
      light.status.color = state.color;
      Assets.instance.save(light);
    })
  })
}

Lifx.prototype.onLightOffline = function(lightBulb){
  Assets.instance.getById(lightBulb.id)
  .then( function(light){
    light.status.initialized = false
    light.status.on = false;
    light.status.color = null;
    Assets.instance.save(light);
  })
}

Lifx.prototype.reset = function(){
  Lifx.client.startDiscovery()
}

Lifx.on = function( namedLights, color ){
  Assets.instance.getByIdFromNames(namedLights)
  .then( function(lights){
    lights.forEach( function(lightId){
      var bulb = Lifx.client.light(lightId)
      if(bulb){
        bulb.on();
        bulb.color( color[0], color[1], color[2], color[3]);
        Assets.instance.getById( lightId )
        .then( function(light){
          light.status.on = true;
          light.status.color = color;
          Assets.instance.save(light);
        })
      }
    })
  }).done();
}

Lifx.off = function(namedLights){
  Assets.instance.getByIdFromNames(namedLights)
  .then( function(lights){
    lights.forEach( function(lightId){
      var bulb = Lifx.client.light(lightId);
      Assets.instance.getById( lightId )
      .then( function(light){
        if(bulb){
          bulb.off();
          light.status.on = false;
          light.status.color = null;
          Assets.instance.save(light);
        }
      });
    })
  }).done();
}

module.exports = Lifx;
