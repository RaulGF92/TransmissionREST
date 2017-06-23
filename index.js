const express = require('express');
const fileUpload = require('express-fileupload');
const transmission = require('./transmissionAPI');

const methods={'methods' : [
    {'url':'/','description':'Get all URL methods','state': 'CHECK'},
    {'url':'/load','description':'Load the transmissionServer','state': 'CHECK'},
    {'url':'/info','description':'Get transmission server info','state': 'CHECK'},
    {'url':'/all','description':'Get all torrents in server','state': 'CHECK'},
    {'url':'/active','description':'Get all active torrents','state': 'CHECK'}
]};

//var loader = false;
var loader = true;

var server ={
        port: 9091,			
        host: '192.168.103.16',			
        username: 'transmission',	
        password: 'transmission',
        url:'/transmission/rpc'	
    };

//-------------------------[ REST SERVER CONFIG ]---------------------------------------------- 

const app = express();
app.use(fileUpload());

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
    res.send({'msg':'Serve we gonna connect','server': server});
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

app.post('/torrent/add/file', function(req, res) {

    res.set('Content-Type', 'application/json');

    if(!loader){
        res.send({"msg":"The server transmission target don't be loader, please load using /load method"});
        return;
    }

    if (!req.files)
        return res.status(400).send('No files were uploaded.');
 
    let torrentFile = req.files.torrentFile;

    transmission.addTorrentString(server,torrentFile.data).then(function(data){
        res.send(data);
    });
 
});

//-------------------------[ Express Server invoke ]---------------------------------------------- 
app.listen('8888',function(){
    console.info("[Transmission Node Rest] is listenning on PORT 8888");
});