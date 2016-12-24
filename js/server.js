var server = {
    guid : function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }
};

module.exports.server = server;

/*
var boneco = {
    px: 1,
    py : 2,
    atirar : function(a)
    {
        return function(x)
        {
            a.dispararTiro(this.px,this.py,x);
        };
    }    
};

var arma12 = {
    dispararTiro: function(px,py,vento){
        //dar tiro
    }
}
var pistola = {
    dispararTiro: function(px,py,vento){
        //dar tiro
    }
}

var dispararTiro = boneco.atirar(arma12); 
var vento = "50";
dispararTiro(vento);
*/


/*$(document).ready(function(){
    serverRoom.append(personal.start(<%=use%>,
    {
        textData : $("#textMessage"),
        chatRoom : $("#chatRoom")
    }))
   $(window).keypress(personal.move);
});


var socket = io();
      $('form').submit(function(){
      personal.start();
      server.sendData()
      
      socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });

var serverRoom = {
    persons : [],
    append : function(p,data){
        p.
    }
};*/