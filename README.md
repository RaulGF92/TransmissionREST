#GET STARTED
You must download the code using git and them make the update of npm code using the next command:

```
npm upgrade
npm update

```

then you only need run the main program using the next command:
> node index.js 

#Using the program
If you need know all the orders you only make a petition http to the IP of the server and the server send it a list of HTTP method.

```
{'methods' : [
    {'url':'/','description':'Get all URL methods','state': 'CHECK'},
    {'url':'/info','description':'Get transmission server info','state': 'CHECK'},
    {'url':'/all','description':'Get all torrents in server','state': 'CHECK'},
    {'url':'/active','description':'Get all active torrents','state': 'CHECK'}
]}
```