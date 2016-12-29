/**
 * A little application for the talk with moving of the avatars
 * @type Module Main|Module server
 * @author Wesdras Alves <wesdras.alves@gmail.com>
 */

var helper = require('./js/server.js');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var existsUser = false;
var expressSession = require('express-session');

var idRoom = 'room';

app.set("view engine", 'ejs');
app.use("/scripts",express.static(__dirname + '/public/js'));
app.use("/style",express.static(__dirname + '/public/css'));
app.use("/img",express.static(__dirname + '/public/img'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',resave: true, saveUninitialized: true}));

//Main function start, Method GET
app.get('/', function(req, res){
    var key;
    
    //Generate acess key (GUID) for a new user that is opening the first page
    //The loop exists for generate keys exclusive
    do
    {
        key = helper.server.guid();
    }
    while({start : function()
        {
            if(expressSession.chatRoom)  
                for(var i = 0;i< expressSession.chatRoom.persons.length;i++)
                    if(expressSession.chatRoom.persons[i].key == key)
                        return true;
            return false;
        }
    }.start());
    
    //Rendering the page by passing the exclusive key 
    res.render('index',{key : key});
});

//Acess after the user data fill, Method POST
app.post('/', function(req, res){
    var person = {};
    //I created other key more short for control the user in screen, case exist user name repeated
    var UID = (Math.floor(Math.random() * 0x1000)+1).toString(10) + '_';

    //class of user in JSON for send to screen
    person = {
        key : req.body.key,
        userId : UID,
        user : req.body.user,
        posX : 0,
        posY : 0,
        active : false
    };
   
    //Check if exist a session created 
    if(!expressSession.chatRoom)
    {
        expressSession.chatRoom = {
            id : idRoom,
            persons : []
        };
    }
    
    for(var i = 0;i< expressSession.chatRoom.persons.length;i++)
    {
        if(expressSession.chatRoom.persons[i].key == person.key)
        {
            person = expressSession.chatRoom.persons[i];
            existsUser = true;
        }
    }

    if(!existsUser) expressSession.chatRoom.persons.push(person);
    res.render('chat',{person:person,
                        chatRoom : expressSession.chatRoom});
});

//Open connection with Socket for comunication with users and replicate 
//all the sends of chat for all the users
io.on('connection', function(socket){
    socket.on(idRoom, function(data){
        if(data.type == 'object')
        {
            
            for(var i = 0;i< expressSession.chatRoom.persons.length;i++)
            {
                if(expressSession.chatRoom.persons[i].userId + 
                   expressSession.chatRoom.persons[i].user == data.data.id)
                {
                    expressSession.chatRoom.persons[i].posX = data.data.posX;
                    expressSession.chatRoom.persons[i].posY = data.data.posY;
                    break;
                }
            }
        }
        io.emit(idRoom, data);
    });
    socket.on('checkOnline', function(data){
        
    });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});