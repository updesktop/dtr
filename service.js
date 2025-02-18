var Service = require('node-windows').Service;
var svc = new Service({
 name:'coldroom',
 description: 'Node.js service description goes here.',
 script: 'C:\\coldchain\\server.js'
});

svc.on('install',function(){
 svc.start();
});

svc.install();