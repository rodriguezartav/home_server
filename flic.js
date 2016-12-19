var request = require("superagent");
var fliclib = require("./fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;
var Log = require("./log");

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

var Flic = function(){
  var client = new FlicClient("localhost", 5551);

  client.once("ready", function() {
    Log.set("Flic Connected to daemon");
    client.getInfo(function(info) {

      info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
        Log.set("New Button Address: " + bdAddr)
        Flic.listenToButton(client, bdAddr);
      });
    });
  });

  client.on("bluetoothControllerStateChange", function(state) {
    Log.set("Bluetooth controller state change: " + state);
  });

  client.on("newVerifiedButton", function(bdAddr) {
    Log.set("A new button was added: " + bdAddr);
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
    Log.set(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
    Flic.handleClicks( bdAddr, clickType );
  });

  cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
    Log.set(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
  });
}


Flic.handleClicks = function(address, clickType){

  var buttonCode = ButtonMap[address];
  var sceneName = ConnectionMap[buttonCode][clickType];

  if( !sceneName ) return;

  request.get("http://localhost/scene/" + sceneName)
  .end( function(err,res){
    console.log(res.text);
  })

}

new Flic();
