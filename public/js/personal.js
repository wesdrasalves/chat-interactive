

var personal = {
        positionX : 0,
        positionY : 0,
        name : '',
        id : '',
        getHtml : {},
        sizeSprite: 32,
        lineDown: 4,
        lineRight: 2,
        lineLeft: 3,
        lineUp: 1,
        moving : true,
        start : function(pname,px,py){
            var obj = this.create(pname,px,py);
            
            
            /*$.each(Object.getOwnPropertyNames(this.create(pname,px,py)),function(k,v)
            {
                alert(v);
            });
            */
            this.id = obj.id; 
            this.name = obj.name; 
            this.positionX = obj.positionX; 
            this.positionY = obj.positionY; 
            this.getHtml = obj.getHtml; 
            
            this.getKeyMove = this.getKeyMove(this);
            //per.att("id","");            
            return this;
        },
        create : function(pname,px,py)
        {
            var obj = {};
            
            obj.name = pname.split('_')[1];   
            
            obj.id = pname;
            
            obj.positionX = px;
            obj.positionY = py;            
            
            var per = $("<div>", {
                    id : obj.id ,
                    class: 'personChat'
                }).css("margin-top",obj.positionX).css("margin-left",obj.positionY);

            
            per.append($("<div>",{class: 'namePerson', text: obj.name}).hide());        
            per.append($("<img>",{class: 'person1'}).mouseover(function(){ $("#" + obj.id + ' .namePerson').show();}).mouseout(function(){ $("#" + obj.id + ' .namePerson').hide();}));
            per.append($("<div>",{class: 'boxMessageClient'}).css("display","none").hide());
            obj.getHtml = per;
            
            return obj;
        },
        move : function(s)
        {
            return function(x,y,personSend){
                if(x) this.positionX = x;
                if(y) this.positionY = y;
                personSend.posX = x;
                personSend.posY = y;
                s.sendObject(personSend);
            };
        },
        changeSprite : function(lineSprite)
        {
            var px = $("#"+ this.id + " img").css("background-position-x").replace("px",'');
            var py = $("#"+ this.id + " img").css("background-position-y").replace("px",'');

            py = this.sizeSprite * lineSprite;            
            px /= this.sizeSprite;            
            
            if(px >3) px*=-1;
            px+=1;
            
            px *= this.sizeSprite;
            px = Math.abs(px);
            
            $("#"+ this.id + " img").css("background-position-x",px+'px');
            $("#"+ this.id + " img").css("background-position-y",py+'px');            
            
            return {id: this.id, 
                    posX : this.position,
                    posY : this.positionY,
                    spriteX : px + 'px',
                    spriteY : py + 'px'
                };
            
        },
        toLeft : function(p)
        {
            var pos = parseInt(p.getHtml.css("margin-left").replace('px',''));
            if(pos > 0) p.getHtml.css("margin-left",pos -4);                        
            return this.changeSprite(this.lineLeft);
        },
        toUp : function(p)
        {
            var pos = parseInt(p.getHtml.css("margin-top").replace('px',''));
            if(pos > 0) p.getHtml.css("margin-top",pos -4);            
            return this.changeSprite(this.lineUp);
        },
        toRight : function(p)
        {
            var pos = parseInt(p.getHtml.css("margin-left").replace('px',''));
            if(pos < parseInt($("#chatRoom").css("width").replace('px',''))-35) p.getHtml.css("margin-left",pos +4);            
            return this.changeSprite(this.lineRight);
        },
        toDown : function(p)
        {
            var pos = parseInt(p.getHtml.css("margin-top").replace('px',''));
            if(pos < parseInt($("#chatRoom").css("height").replace('px',''))-35)
            p.getHtml.css("margin-top",pos +4);            
            return this.changeSprite(this.lineDown);
        },        
        getKeyMove : function (p)
        {     
            return function(e){ 
                var x = 0;
                var y = 0;

                if(this.moving)
                {
                    this.moving = false;
                    setTimeout(function() { personal.moving = true; }, 200);
                    
                    x = p.getHtml.css("margin-top");
                    y = p.getHtml.css("margin-left");

                    switch(e.keyCode)
                    {
                        //Left
                        case 37 :
                            this.move(x,y,p.toLeft(p));
                            break;
                        //Up
                        case 38 :
                            this.move(x,y,p.toUp(p));
                            break;
                        //Right
                        case 39 :
                            this.move(x,y,p.toRight(p));
                            break;
                        //Down
                        case 40 :
                            this.move(x,y,p.toDown(p));
                            break;                    
                    }                
                }
            };
        },
        talk : function(s)
        {
            return function(x){
                s.sendText(x,this);
            };
        }
    };

