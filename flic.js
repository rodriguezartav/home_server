var request = require("superagent");
var fliclib = require("./fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;
var Log = require("./log");
var Assets = require("./helpers/assets");
var QSQL = require('q-sqlite3');

var Colors = {
 "default": [50, 60, 100,4000],
 "low": [50, 60, 15,3000],
 "mid": [50, 60, 50,3000],
 "high": [50, 60, 100,4000],
 "whiteNormal": [50, 60, 100,6000],
 "highCold": [50, 60, 100,7000],
 "purple": [200,80,100,7000],
 "red": [10,80,100,7000],
 "green": [100,80,100,7000],
 "orange": [50,80,100,7000],
 "yellow": [150,80,100,7000]
}

var ButtonMap = {
  "80:e4:da:71:bf:2f": "VERDE_PRINCIPAL",
  "80:e4:da:71:d6:09": "BLANCO_PRINCIPAL",
  "80:e4:da:71:bf:fc": "AZUL_PRINCIPAL",
  "80:e4:da:71:c2:3f": "BLANCO_SECUNDARIO",
  "80:e4:da:71:60:24": "VERDE_SECUNDARIO",
  "80:e4:da:71:aa:88": "NEGRO_SECUNDARIO"
}

var ConnectionMap = {
  "AZUL_PRINCIPAL": {
    "ButtonSingleClick": "MainRoom_Lights_Normal",
    "ButtonDoubleClick": "MainRoom_Lights_Off",
    "ButtonHold":"MainRoom_Lights_Low"
  },
  "VERDE_PRINCIPAL": {
    "ButtonSingleClick": "MainRoom_Martino",
    "ButtonDoubleClick": "MainRoom_Martino",
    "ButtonHold":"MainRoom_Martino"
  },
  "BLANCO_SECUNDARIO": {
    "ButtonSingleClick": "Lapas_Lights_High",
    "ButtonDoubleClick": "Lapas_Lights_Off",
    "ButtonHold":"Lapas_Lights_Low"
  },
  "VERDE_SECUNDARIO": {
    "ButtonSingleClick": "Tortuga_Lights_High",
    "ButtonDoubleClick": "Tortuga_Lights_Off",
    "ButtonHold":"Tortuga_Lights_Low"
  },
  "AZUL_SECUNDARIO": {
    "ButtonSingleClick": "Tortuga_Bath_Lights_Timmer",
    "ButtonDoubleClick": "Tortuga_Bath_Lights_Off",
    "ButtonHold":"Tortuga_Bath_Lights_High"
  },
  "NEGRO_SECUNDARIO": {
    "ButtonSingleClick": "Lapas_Bath_Lights_Timmer",
    "ButtonDoubleClick": "Lapas_Bath_Lights_Off",
    "ButtonHold":"Lapas_Bath_Lights_High"
  },
}

var Scenes= {
  "MainRoom_Lights_Normal": {
    fans: {name: "sala", speed: 2},
    lights: [
      {names: ["SalaI","CocinaI","CocinaII","CocinaIII"], action: "on", color: Colors.high}
    ]
  },
  "MainRoom_Lights_Low": {
    fans: {name: "sala", speed: 1},
    lights: [
      {names: ["SalaI","CocinaI","CocinaII","CocinaIII"], action: "on", color: Colors.mid}
    ]
  },
  "MainRoom_Lights_Off": {
    fans: {name: "sala", speed: 0},
    lights: [
      {names: ["SalaI","CocinaI","CocinaII","CocinaIII"], action: "off"}
    ]
  }
}

var Flic = function(){

  QSQL.createDatabase('./db/db').done(function(db) {
    new Assets(db)
  })

  var client = new FlicClient("localhost", 5551);

  client.once("ready", function() {
    Log.set("Flic Connected to daemon");
    client.getInfo(function(info) {
      info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
        Assets.instance.changeStatus(bdAddr, { initialized: true, on: true }).done();
        Flic.listenToButton(client, bdAddr);
      });
    });
  });

  client.on("bluetoothControllerStateChange", function(state) {
    Log.set("Bluetooth controller state change: " + state);
  });

  client.on("newVerifiedButton", function(bdAddr) {
    Log.set("A new button was added: " + bdAddr);
    Assets.instance.changeStatus(bdAddr, { initialized: true, on: true }).done();
    listenToButton(bdAddr);
  });

  client.on("error", function(error) {
    Log.set("Daemon connection error: " + error);
  });

  client.on("close", function(hadError) {
    Log.set("Connection to daemon is now closed");
  });
}

Flic.listenToButton = function (client, bdAddr) {
  var cc = new FlicConnectionChannel(bdAddr);
  client.addConnectionChannel(cc);

  cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
    //Log.set(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
    Flic.handleClicks( bdAddr, clickType );
  });

  cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
    Assets.instance.getById(bdAddr)
    .then( function(button){
      var on = false
      if( connectionStatus != "Disconnected" ) on = true;
      button.status.initialized = on;
      button.status.on = on;
      Assets.instance.save(button);
    }).done();
  });
}

Flic.handleClicks = function(address, clickType){
  Assets.instance.getById(address)
  .then( function(button){
    var sceneName = ConnectionMap[button.name][clickType];
    if( !sceneName ) return;
    var params = Scenes[sceneName];

    request.post("http://localhost/bulk")
    .send(params)
    .end( function(err,res){
      console.log(res.text);
    })
  })
}

new Flic();
