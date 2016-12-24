var socket = io();
/*
      
      personal.start();
      server.sendData()
      
      socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });

*/

var roomServer = {
    textData : {},
    chatRoom : {},
    persons : [],
    roomUID : '',
    start : function(p,d){
        this.textData = d.textData;
        this.chatRoom = d.chatRoom;
        this.roomUID = d.roomId;

        p.talk = p.talk(this);       
        p.move = p.move(this);       
        this.addPerson(p);
        
        this.sendObject(p,true);
        this.bind();
        
    },
    addPerson : function(p){            
        this.persons.push(p);        
        p.getHtml.appendTo(this.chatRoom);
    },
    sendText : function(t,p){
        socket.emit(this.roomUID, {type:'text', data: {text : t, id : p.id}});
    },
    sendObject : function(p,t){
        var data = {};

        if(t)
        {
            data = {
                id : p.id,
                posX : p.positionX,
                posY : p.positionY,
                'new' : t,
                person : p,
                spriteX : 0,
                spriteY : 0
            };
            
        }else
        {
            data= {
                    id : p.id,
                    posX : p.posX,
                    posY : p.posY,
                    'new' : false,
                    person : {},
                    spriteX : p.spriteX,
                    spriteY : p.spriteY
                };
        }
        
        socket.emit(this.roomUID, {type:'object', data : data});        
    },
    renderResponse : function(res){
        switch(res.type)
        {
            case 'text':
                this.renderMessageText(res.data.id,res.data.text);
                break;
            case 'object':
                this.renderObject(res.data);                
                break;
        }
    },
    bind : function()
    {
        socket.on(this.roomUID, function(data){roomServer.renderResponse(data);});
    },
    renderMessageText : function(id,message){
        $('#'+ id + " .boxMessageClient").text(message);
        $('#'+ id + " .boxMessageClient").show().delay(5000).fadeOut(400);
        $("ul").append("<li>" + id + ' - ' + message + "</li>");
    },
    renderObject : function(d){
        if(d.new)
        {
            if($.map(this.persons,function(v){
                if(v.id == d.id)return d.person;
            }).length == 0)
            {
                this.addPerson(personal.create(d.id,d.posX,d.posY));
                this.sendObject(this.persons[0],true);        
            }
            else if(this.persons[0].id != d.id)
            {
                this.sendObject(this.persons[0],true);                        
            }
            
        }
        else if(d.id != this.persons[0].id)
        {
            $("#" + d.id).css("margin-top",d.posX);
            $("#" + d.id).css("margin-left",d.posY);
            $("#" + d.id + ' img').css("background-position-x",d.spriteX);
            $("#" + d.id + ' img').css("background-position-y",d.spriteY);            
        }
    }
};