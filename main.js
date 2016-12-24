var helper = require('./js/server.js');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
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

app.get('/', function(req, res){
    var key;
    
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
    

    res.render('index',{key : helper.server.guid()});
});

app.post('/', function(req, res){
    var person = {};
    var UID = (Math.floor(Math.random() * 0x1000)+1).toString(10) + '_';

    person = {
        key : req.body.key,
        userId : UID,
        user : req.body.user,
        posX : 0,
        posY : 0,
        active : false
    };
   
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
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});