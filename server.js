var express = require('express');
var app = express();
var Log = require("./log");
var cors = require('cors')

var router = express.Router();
var bodyParser = require('body-parser')
app.use(cors());

app.use(bodyParser.json())

app.use(express.static('kyd/build'));


var moment = require("moment");

var Scenes = require("./scenes");
var lx = require('./lx');

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

var Fans = {
  "sala": [35,36],
  "lapas": [38,40],
  "tortuga": [31,33]
}

var scenes = new Scenes(lx,Bulbs, Fans);


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


router.get('/scene/:name', function (req, res) {
  if( Scenes[req.params.name] ){
    Scenes[req.params.name]();
    Log.set("Start Scene: " + req.params.name);
    if(req.queryui=true) res.redirect("/")
    else res.sendStatus(200);
  }else{
    res.status(503).send("Scene not found");
  }

});

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
