var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

client.on('light-new', function(light) {
  console.log("Light:", light.id, light.address, light.label || light.name, light.status);
});

client.init();

module.exports = client;


/*


var lifx = require('lifx');
var util = require('util');

var lx = lifx.init();

lx.on('bulbstate', function(b) {
 console.log('Bulb state: ' + util.inspect(b));
});

lx.on('bulbonoff', function(b) {
 console.log('Bulb on/off: ' + util.inspect(b));
});

lx.on('bulb', function(b) {
 console.log('New bulb found: ' + b.name + " : " + b.addr.toString("hex"));
});

lx.on('gateway', function(g) {
 console.log('New gateway found: ' + g.ip);
});

process.on("exit", function(){
  lx.close();
})

module.exports = lx;


*/
