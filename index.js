const express = require('express');
const fileUpload = require('express-fileupload');
const transmission = require('./transmissionAPI');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const fs = require('fs');
var clc = require('cli-color');

const methods={'methods' : [
    {'get':[
        {'url':'/','description':'Get all URL methods','state': 'CHECK'},
        {'url':'/load','description':'Load the transmissionServer','state': 'CHECK'},
        {'url':'/info','description':'Get transmission server info','state': 'CHECK'},
        {'url':'/all','description':'Get all torrents in server','state': 'CHECK'},
        {'url':'/active','description':'Get all active torrents','state': 'CHECK'},
        {'url':'/torrent/start/{id}','description':'start the torrent','state': 'NOT_PROBE'},
        {'url':'/torrent/stop/{id}','description':'stop the torrent','state': 'NOT_PROBE'},
        {'url':'/torrent/delete/{id}','description':'delete the torrent','state': 'NOT_PROBE'},
        {'url':'/torrent/add/url','description':'example of POST petition of the same Map URL','state': 'CHECK'},
        ]
    },{'post':[
            {'url':'/torrent/add/file','description':'Accept a File for start a torrent download','state': 'CHECK'},
            {'url':'/load','description':'Accept a JSON object to Load the transmissionServer (make get /load method)','state': 'CHECK'},
            {'url':'/torrent/add/url','description':'Accept a URL for start a torrent download','state': 'NOT_PROBE'},
        ]
    }]};

//var loader = false;
var loader = true;
var server={}
var adminPassword="";
var change=0;

//-------------------------[ REST SERVER CONFIG ]---------------------------------------------- 


const app = express();
app.use(fileUpload());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

loadApp();

//-------------------------[     HTTP METHODS     ]---------------------------------------------- 
app.get('/',function(req,res){

    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(methods));

});


app.get('/info',function(req,res){

    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.checkServerInfo(server).then(function(data){
        res.send(data);
    });

});

app.get('/all',function(req,res){
    
    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.getAllTorrents(server).then(function(data){
        res.send(data);
    })
});

app.get('/load',function(req,res){

    server ={
        port: 9091,			
        host: '192.168.103.16',			
        username: 'transmission',	
        password: 'transmission',
        url:'/transmission/'	
    };
    loader=true;

    res.set('Content-Type', 'application/json');
    res.send({'msg':'Serve it gonna connect','server': server});
});

app.get('/active',function(req,res){
    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.getAllActiveTorrents(server).then(function(data){
        res.send(data);
    })
});

app.get('/torrent/start/:id',function(req,res){
    var id=req.params.id;
    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.startTorrent(id).then(function(data){
        res.send(data);
    });
});

app.get('/torrent/stop/:id',function(req,res){
    var id=req.params.id;
    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.stopTorrent(id).then(function(data){
        res.send(data);
    });
});

app.get('/torrent/delete/:id',function(req,res){
    var id=req.params.id;
    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    transmission.stopTorrent(id).then(function(data){
        res.send(data);
    });
});

app.get('/torrent/add/url',function(req,res){

    res.set('Content-Type', 'application/json');
    var data={'msg':{'url':'http://www.PutUrlYouWant.es'}};

    res.send(data);
});

//___________________________________POST METHOD_________________________________________________

app.post('/torrent/add/url',function(req,res){
    var url=req.body.msg.url;
    if(url == undefined || url == null)
        res.send({msg:'Fail on server entity. Yo need put a entity same as the /load get response'});
        
    transmission.addTorrentUrl(url).then(function(data){
        res.send(data);
    });
});

app.post('/load', upload.array(),function (req, res, next) {

    var response=req.body;
    console.log(response);
    if((response.password == undefined || response.password == null) && response.password == this.adminPassword)
        res.send(JSON.stringify({msg:'Fail on the gestion password'}));
    if(response.server == undefined || response.server == null)
        res.send(JSON.stringify({msg:'Fail on server entity. Yo need put a entity same as the /load get response'}));
    
    var newServer = response.server;

    if(newServer.password.username != undefined || newServer.password.username != null )
        server.username = newServer.password.username;

        
    if(newServer.password != undefined || newServer.password != null )
        server.password = newServer.password;
    
    if(newServer.url != undefined || newServer.url != null )
        server.url = newServer.url;

    if(newServer.host != undefined || newServer.host != null )
        server.host = newServer.host;

    if(newServer.port != undefined || newServer.port != null )
        server.port = newServer.port;
    
    change++;
    showInfoConsole();

    res.send({'msg':'Serve it gonna connect','server': server});
    
});

app.post('/torrent/add/file', function(req, res) {

    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    if (!req.files)
        return res.status(400).send('No files were uploaded.');
 
    let torrentFile = req.files.torrentFile;
    console.log(torrentFile);

    
    transmission.addTorrentString(server,torrentFile.data).then(function(data){
        res.send(data);
    });
    
});

function loadApp(){
    fs.readFile('properties.json','UTF8',function name(err,data) {
        if(err){
            console.error("[Transmission Node Rest] Fail loading properties");
            process.exit(1);
        }

        objToLoad=JSON.parse(data).properties;
        server=objToLoad.defaultServer;
        adminPassword=objToLoad.adminPassword;

        app.listen('8888',function(){
            showInfoConsole();
        });
    })
}

//-------------------------[ Express Server invoke ]---------------------------------------------- 


function showInfoConsole(){
            var msg = clc.xterm(221);
            console.clear;
            console.info("            Transmission Node Rest Made by "+msg('RaulGF92')+"        ");
            console.info("  ---------------------------------------------------------");
            console.info("  |  [Transmission Node Rest] is listenning on PORT  "+clc.red('8888')+"  |");
            console.info("  ---------------------------------------------------------");
            console.info("                Server transmission Info:     (change:"+change+")  ");
            console.info("");
            console.info(server);
}