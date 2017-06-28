# GET STARTED
You must download the code using git and them make the update of npm code using the next command:

> npm upgrade

then you only need run the main program using the next command:
> npm start

Remember this Server make a comunication with a transmission server, so you must change server data on properties file. If you don't change for defect the server gonna connect with a teorical server in the localhost (See config the server).

# Config the server
The REST server starting using the default properties of the file ''properties.json''. The properties file is in the main path and hav some variables:
1. defaultServer: Is the server data object use for the rest server to connect to tranmission external servers
   1. username/password: User info show in the transmission properties
   2. host: IP Direction of your transmission server
   3. url:  URL mapped of rpc server must be '/transmission/' or '/transmission/rpc'
   4. port: Port where the transmission server is listenning must be the 9091 (number not string)
2. adminPassword: Password use in methods admin POST of server

If you like change something about the server you must turn off the server, change all the you want and them turn on the service.

# Using the program
If you need know all the orders you only make a petition http to the IP of the server and the server send it a list of HTTP method.

```
{'methods' : [
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
```
For upload .torrent using file method, you must using a form in a website, using the next example you can change a file between the client and the server. You must change the action and put the IP of your node server.

```
<html>
  <body>
    <form ref='uploadForm' 
      id='uploadForm' 
      action='http://localhost:8888/torrent/add/file' 
      method='post' 
      encType="multipart/form-data">
        <input type="file" name="torrentFile" accept=".torrent"/>
        <input type='submit' value='Upload!' />
    </form>     
  </body>
</html>
```
