var ButtonMap = {
  "80:e4:da:71:bf:2f": "VERDE_PRINCIPAL",
  "80:e4:da:71:d6:09": "BLANCO_PRINCIPAL",
  "80:e4:da:71:bf:fc": "AZUL_PRINCIPAL",
  "80:e4:da:71:c2:3f": "BLANCO_SECUNDARIO",
  "80:e4:da:71:60:24": "VERDE_SECUNDARIO",
  "80:e4:da:71:aa:88": "NEGRO_SECUNDARIO"

}


var ConnectionMap = {
  "VERDE_PRINCIPAL":"",
  "AZUL_PRINCIPAL": [ "d073d5120d25" ], //Sala
  "BLANCO_SECUNDARIO": ["d073d51310b4"], //cuarto lapas
  "VERDE_SECUNDARIO": ['d073d513247e']
}

var Flic = require("./flic");

Flic.handleClicks = function(address, clickType){
  //var b = lx.bulbs['d073d5120d25'];


  var buttonCode = ButtonMap[address];
  //console.log(buttonCode);
  if( clickType == "ButtonSingleClick" ) console.log("click")

}

function allLightsOn( lights ){
  console.log("on", lights)

  lights.forEach( function(light){
    lx.light(light).on();
    lx.light(light).color(50,60,100);
  })
}



function allLightsDim( lights ){



  lights.forEach( function(light){

    lx.light(light).color(50,60,50);


    //console.log("dim light " , light, lx.bulbs[light]);

//    lx.lightsColour(0, 0, 400 & 0xffff, 0, 0, lx.bulbs[light]);
    //lx.lightsColour(0, 0xffff, 500 & 0xffff, 0x0dac, 0x0000,light);
  })
}

function allLightsOff( lights ){
  console.log("off", lights)
  lights.forEach( function(light){
    lx.light(light).off();
  })
}
