/**
 * Variable used for control of socket, send and replicate messages with the users
 * @type Socket
 */
var socket = io();

/**
 * Object used for control the room, communication from client to server by socket, 
 * draw users and messages in screen and all controls from client to server 
 * @author Wesdras Alves <wesdras.alves@gmail.com>
 * @version 1.0
 * @type object roomServer
 */
var roomServer = {
    chatRoom : {},  //Object html where the users will be drawn
    persons : [],   //List objects person online
    roomUID : '',   //key of rooms to communication of all users
    start : function(p,d){
        
        this.chatRoom = d.chatRoom;
        this.roomUID = d.roomId;

        /*Overwrite the method talk of person passing the server by parameter
         * and call the method of sendMessage from server */
        p.talk = p.talk(this);       
        
        /*Overwrite the method move of person passing the server by parameter 
         * and call the method of sendObject from server */ 
        p.move = p.move(this);       
        this.addPerson(p);
        
        //Send for all users the creating the my user
        this.sendObject(p,true);
        
        //Open connection the room by socket with the server
        socket.on(this.roomUID, function(data){roomServer.renderResponse(data);});
        
    },
    /**
     * The Method used for adding users at server and in screen at element chatRoom
     * @param {person} p
     * @returns {Jquery(object)} 
     */
    addPerson : function(p){            
        this.persons.push(p);        
        return p.getHtml.appendTo(this.chatRoom);
    },
    /**
     * 
     * @param {string} t - Text message to be send 
     * @param {person} p
     * @returns {undefined}
     */
    sendText : function(t,p){
        socket.emit(this.roomUID, {type:'text', data: {text : t, id : p.id}});
    },
    /**
     * 
     * @param {person} p
     * @param {boolean} t - Type of send object new or old
     * @returns {roomServer.sendObject.data} 
     *      data.id : key of user to object at screen
     *      data.posX : position X of person at screen
     *      data.posY : position Y of person at screen
     *      data.new : True for the new user in the Room or False if the user is a user old in the room
     *      data.person : Object person with all properties 
     *      data.spriteX : position X of the sprite image at screem
     *      data.spriteY : position Y of the sprite image at screem
     */ 
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
        
        //Send object for the server
        socket.emit(this.roomUID, {type:'object', data : data});        
        
        return data;
    },
    /**
     * 
     * @param {object} res 
     *      res.type : Exists two types, text|object. The type Text is for send message at chat Room
     *                The type Object is for the send of new person or new position of the person at screen
     * @returns {undefined}
     */
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
    /**
     * Draw the message at the screen and in box of historic message
     * @param {string} id - Id of the person element at screen
     * @param {type} message 
     * @returns {undefined}
     */
    renderMessageText : function(id,message){
        $('#'+ id + " .boxMessageClient").text(message);
        $('#'+ id + " .boxMessageClient").show().delay(5000).fadeOut(400);
        $("ul").append("<li>" + id + ' - ' + message + "</li>");
    },
    /**
     * Draw the object at the screen when the person is a new user or the user to move
     * @param {roomServer.sendObject.data} d 
     * @returns {undefined}
     */
    renderObject : function(d){
        if(d.new)
        {
            //check if person is in my screen, Add if the person it is not in my screen,
            if($.map(this.persons,function(v){
                if(v.id == d.id)return d.person;
            }).length == 0)
            {
                this.addPerson(person.create(d.id,d.posX,d.posY));
                this.sendObject(this.persons[0],true);        
            }
            else if(this.persons[0].id != d.id) //Send my peson with answer for the new person online
            {
                this.sendObject(this.persons[0],true);                        
            }
            
        }
        else if(d.id != this.persons[0].id) //Move the others persons in my screen
        {
            $("#" + d.id).css("margin-top",d.posX);
            $("#" + d.id).css("margin-left",d.posY);
            $("#" + d.id + ' img').css("background-position-x",d.spriteX);
            $("#" + d.id + ' img').css("background-position-y",d.spriteY);            
        }
    }
};