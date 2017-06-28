const Transmission=require('transmission');

const transmissionAPI= function(options){

    var defaultOptions={
        port: 9091,			
        host: '127.0.0.1',			
        username: 'transmission',	
        password: 'transmission',
        url:'/transmission/'	
    };

    var _transmission=undefined;
    
    if(checkContent(options)){
        options=defaultOptions;
        console.info("[TransmissionAPI] Setting up default settings");
    }else{

        if(checkContent(options.username))
            options.username = defaultOptions.username;

        if(checkContent(options.password))
            options.password = defaultOptions.password;

        if(checkContent(options.port))
            options.port = defaultOptions.port;   

        if(checkContent(options.host))
            options.host = defaultOptions.host;

        if(checkContent(options.url))
            options.url = defaultOptions.url;
    }

};

transmissionAPI.checkServerInfo = function(conectOptions){
        
        if(!checkContent(conectOptions)){
            transmissionAPI._transmission=new Transmission(conectOptions);
        }else{
            transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
        }

        var p=new Promise(function(resolve,reject){
            transmissionAPI._transmission.sessionStats(function(err, result){
                if(err){
                     resolve(err);
                     
                } else {
                    resolve(result);
                }
            });
        });
        return p;
};   

transmissionAPI.getAllTorrents = function(conectOptions){
        
        if(!checkContent(conectOptions)){
            transmissionAPI._transmission=new Transmission(conectOptions);
        }else{
            transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
        }
        
        var p=new Promise(function(resolve,reject){
            transmissionAPI._transmission.all(function(err, result){
                if(err){
                     resolve(err);
                     
                } else {
                    resolve(parseResults(result.torrents));
                }
            });
        });
        return p;
};  

transmissionAPI.getAllActiveTorrents = function(conectOptions){
        
        if(!checkContent(conectOptions)){
            transmissionAPI._transmission=new Transmission(conectOptions);
        }else{
            transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
        }
        
        var p=new Promise(function(resolve,reject){
            transmissionAPI._transmission.active(function(err, result){
                if(err){
                     resolve(err);
                     
                } else {
                    resolve(parseResults(result.torrents));
                }
            });
        });
        return p;
}; 

transmissionAPI.addTorrentString = function(conectOptions,bufferFile){
        
        if(!checkContent(conectOptions)){
            transmissionAPI._transmission=new Transmission(conectOptions);
        }else{
            transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
        }
        
        var p=new Promise(function(resolve,reject){
            transmissionAPI._transmission.addBase64(
            bufferFile.toString("base64"), 
            {"download-dir" : "~/transmission/torrents"}, 
            function(err, result) {
                if (err) {
                    resolve(err);
                }
                
                resolve({'torrent_ID':  result.id});
            });
        });
        return p;
};   

transmissionAPI.addTorrentUrl=function(url){
        if(!checkContent(conectOptions)){
            transmissionAPI._transmission=new Transmission(conectOptions);
        }else{
            transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
        }
        
        var p=new Promise(function(resolve,reject){
            transmissionAPI._transmission.addUrl(url, {
                "download-dir" : "~/transmission/torrents"
            }, function(err, result) {
                if (err) {
                    resolve(err);
                }
                var id = result.id;
                resolve({'torrent_ID':  result.id});
            });         
        });

        return p;
}

transmissionAPI.deleteTorrent=function(id){

    if(!checkContent(conectOptions)){
        transmissionAPI._transmission=new Transmission(conectOptions);
    }else{
        transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
    }

    var p=new Promise(function(resolve,reject){
             transmissionAPI._transmission.remove(id, true, function(err, result){
                if (err){
                    resolve(err);
                } else {
                     transmissionAPI._transmission.get(id, function(err, result) {
                        if(err)
                            resolve({'msg':"Torrent not found with id:"+id});
                        resolve(result); 
                    });
                }
            });
    });
    return p;
}

transmissionAPI.startTorrent=function(id){
    
    if(!checkContent(conectOptions)){
        transmissionAPI._transmission=new Transmission(conectOptions);
    }else{
        transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
    }

    var p=new Promise(function(resolve,reject){
       transmissionAPI._transmission.start(id, function(err, result){
            if(err)
                resolve(err);
            resolve(result);
        });
    });

    return p;
}

transmissionAPI.stopTorrent=function(id){
    if(!checkContent(conectOptions)){
        transmissionAPI._transmission=new Transmission(conectOptions);
    }else{
        transmissionAPI._transmission=new Transmission(transmissionAPI.defaultOptions);
    }

    var p=new Promise(function(resolve,reject){
        transmissionAPI._transmission.stop(id,function(err,result){
            if(err)
                resolve(err);
            resolve(result);
        });
    });
    return p;
}


transmissionAPI.checkContent=function (object){

    if(object === undefined || object === null){
        return true
    }else{
        return false;
    }
}

transmissionAPI.getStatusType=function (type){
    if(type === 0){
        return 'STOPPED';
    } else if(type === 1){
        return 'CHECK_WAIT';
    } else if(type === 2){
        return 'CHECK';
    } else if(type === 3){
        return 'DOWNLOAD_WAIT';
    } else if(type === 4){
        return 'DOWNLOAD';
    } else if(type === 5){
        return 'SEED_WAIT';
    } else if(type === 6){
        return 'SEED';
    } else if(type === 7){
        return 'ISOLATED';
    }
}

transmissionAPI.parseResults=function(results){
    var torrents = [];

    for(var i=0; i< results.length;i++){
        torrents.push(parseTorrent(results[i]));
    }

    return torrents;
}

transmissionAPI.parseTorrent=function(result){

    var torent={
        "name": result.name,
        "download_Rate" : result.rateDownload/1000,
        "upload_Rate" : result.rateUpload/1000,
        "completed" : result.percentDone*100,
        "ETA" : result.eta/3600,
        "status" : getStatusType(result.status)
    };
    return torent;
}

module.exports = transmissionAPI;

