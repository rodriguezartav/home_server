var express = require('express');
var app = express();
var Log = require("./log");
var cors = require('cors')
var Assets = require("./helpers/assets");
var QSQL = require('q-sqlite3');
var q = require("q");
var GPIO = require('./helpers/gpio');
var Lifx = require('./helpers/lifx');
var router = express.Router();
var bodyParser = require('body-parser')
app.use(cors());
app.use(bodyParser.json())
app.use(express.static('kyd/build'));

var moment = require("moment");


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

var Bulbs = {
  "d073d5120d25": "SalaI",
  "d073d512daec": "SalaII",
  "d073d5108bc4": "CocinaI",
  "d073d510a48e": "CocinaII",
  "d073d5109b30": "CocinaIII",
  "d073d5109f24": "Bano_Tortuga",
  "d073d510a297": "Bano_Lapas",
  "d073d51310b4": "Cuarto_Lapas",
  "d073d513247e": "Cuarto_Tortuga",
}

var Pins = {
  "sala": [35,36],
  "lapas": [38,40],
  "tortuga": [31,33],
  "cargador": [3]
}

setInterval( function(){
  toggleCharger()
}, 10800 * 1000 );

var chargerIsOn = false;
function toggleCharger(){
  GPIO.write( 3, chargerIsOn);
  if( chargerIsOn ) chargerIsOn = false;
  else chargerIsOn = true;
}

var lifx;
var gpio;

QSQL.createDatabase('./db/db').done(function(db) {
  new Assets(db)
  lifx = new Lifx(Bulbs, Colors);
  gpio = new GPIO(Pins);
  //toggleCharger();
})

router.get('/data', function(req,res){
  Assets.instance.getAll()
  .then( function(assets){
    res.send({ assets: assets } );
  }).done();
})

router.get("/pin", function(req,res){
  GPIO.write( req.query.name, req.query.status == "true")
  .then( function(){
    res.send({success: true});
  }).fail( function(err){
    res.send({success: false, error: err});
  }).done()
})

router.get("/fan",function(req,res){
  GPIO.writeForFan(req.query.name,req.query.speed)
  .then( function(){
    res.send({success: true});
  }).fail( function(err){
    res.send({success: false, error: err.toString() });
  }).done()
})

router.get("/light/reset",function(req,res){
  lifx.reset();
  res.send({success: true});
})

router.post("/light",function(req,res){
  var params = req.body;
  Lifx[params.action]([params.name], params.color);
  res.send({success: true});
})

router.post("/bulk", function(req,res){
  var lights = req.body.lights;
  var fan = req.body.fans;

  if( lights){
    lights.forEach( function(light){
      Lifx[light.action](light.names, light.color);
    });
  }

  if(fan){
    GPIO.writeForFan(fan.name, fan.speed);
  }

  setTimeout( function(){ res.send({success: true}); }, 1000 );
})

router.post("/log", function(req,res){
  Log.store(req.body);
  res.send("ok " + JSON.stringify(req.body) );
})

router.get("/log", function(req,res){
  var html = "<h1>Logs</h1><table>";
  Log.get().forEach( function(log){
    html += "<tr>";
    html += "<td style='width: 150px; border-right: 1px solid #ccc;'><small>" + moment(log.time).fromNow() + "</small></td>";
    html += "<td><p>" + log.text + "</p></td>";
    html += "</tr>";
  })
  html += "</table>"
  res.send(html);
})

router.get("/log.json", function(req,res){
 res.send(JSON.stringify( { logs:  Log.get() } ) );
})

router.get("/",function(req,res){
  res.redirect("index.html");
})

router.get("/scenes.json",function(req,res){
  var  realKeys = [];
  var keys = Object.keys( Scenes );
  keys.forEach( function(key){
    if( key.indexOf("_") != 0 ) realKeys.push(key);
  })
  res.send( JSON.stringify( {scenes: realKeys} ) );

})

app.use('/', router);


app.listen(80, function () {
  Log.set('Start Server');
});
