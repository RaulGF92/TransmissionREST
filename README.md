# GET STARTED
You must download the code using git and them make the update of npm code using the next command:

> npm upgrade

then you only need run the main program using the next command:
> node index.js 

*Remember this is a ALFA!!. You must change the server varible on index.js using your transmission server info*

# Using the program
If you need know all the orders you only make a petition http to the IP of the server and the server send it a list of HTTP method.

```
{'methods' : [
    {'url':'/','description':'Get all URL methods','state': 'CHECK'},
    {'url':'/info','description':'Get transmission server info','state': 'CHECK'},
    {'url':'/all','description':'Get all torrents in server','state': 'CHECK'},
    {'url':'/active','description':'Get all active torrents','state': 'CHECK'}
]}
```
For upload .torrent you must using a form in a website, using the next example you can change a file between the client and the server. You must change the action and put the IP of your node server.

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
