"use strict";


var app = app || {};


app.main = {
    animationID: 0,
    WIDTH: 640,
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
    numOfCircles: 10,
    dt: undefined, 
    circles: [],
    score: 0,
    player: {},
    


/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */

    init : function () {
        
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.dt = this.calculateDeltaTime();
        this.player = this.makePlayer();
        this.circles = this.makeCircles(this.numOfCircles);
        this.update();    
}, 
    
    
    //make functions`
    
     makeCircles : function(num){
        var circleMove = function(dt){
            this.x += this.xSpeed * this.speed *  dt;
            this.y += this.ySpeed * this.speed * dt;
        };
        
        var circleDraw = function(ctx){
            ctx.save();
            ctx.fillStyle = "#0099CC";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
        
        var array = [];
        //debugger;
        for(var i=0; i<num; i++){
            var c = {};
            c.x = getRandom(10, this.WIDTH - 10);
            c.y = getRandom(10, this.HEIGHT - 10);
            
            c.radius = 20;
            
            var randomVector = getRandomUnitVector();
            c.xSpeed = randomVector.x;
            c.ySpeed = randomVector.y; 
            
            c.speed = 150;
            c.fillStyle = "#0099CC";
            c.lifetime = 0;
            
            c.draw = circleDraw;
            c.move = circleMove;
            
            Object.seal(c);
            array.push(c);
        }
        return array;
    },
    
       makePlayer : function(){
        var playerMove = function(dt) {
            if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP] || myKeys.keydown[myKeys.KEYBOARD.KEY_W]){
                 this.y -= 150 * dt;
            }
            
            else if(myKeys.keydown[myKeys.KEYBOARD.KEY_DOWN] || myKeys.keydown[myKeys.KEYBOARD.KEY_S] ){
                 this.y += 150 * dt;
            }
            
            
            else if(myKeys.keydown[myKeys.KEYBOARD.KEY_RIGHT] || myKeys.keydown[myKeys.KEYBOARD.KEY_D]){
                this.x += 150 * dt;
            }
            
            
            else if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT] || myKeys.keydown[myKeys.KEYBOARD.KEY_A]){
               this.x -= 150 * dt;
            }
            
            //LU 
            else if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT] && myKeys.keydown[myKeys.KEYBOARD.KEY_UP] || myKeys.keydown[myKeys.KEYBOARD.KEY_A] && myKeys.keydown[myKeys.KEYBOARD.KEY_W]){
               this.x -= 150 * dt;
                this.y -= 150 * dt;
            }
            //RU
            //LD
            //RD
            
        };
        
        var playerDraw = function(ctx){
            ctx.save();
             ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.x, this.y, 30, 30);
            ctx.fill();
            ctx.restore();
        };
        
        var p = {};
        p.x = this.WIDTH/ 2 - 15;
        p.y = this.HEIGHT/2 -15;
        p.width = 40;
        p.height = 30;
        p.fillStyle = "white";
            
        p.draw = playerDraw;
        p.move = playerMove;
        
        Object.seal(p);
        
        return p;
    },
        
        
        //draw functions
        
         drawCircles: function(ctx){
        for(var i=0;i<10; i++){
            var c = this.circles[i];
            c.draw(ctx);
            console.log("Draw circles called")
        }
    }, 
    
            drawPlayer: function(ctx){
            var p = this.player;
            p.draw(ctx);
        },
    
    
        //move functions 
        movePlayer: function(dt){
            var p = this.player;
            
            if(this.playerHitLeft(p)) {
                p.x = this.WIDTH;
            }
            
             if(this.playerHitRight(p)) {
                p.x = 0 - 28;
            }
            
             if(this.playerHitTop(p)) {
                p.y = this.HEIGHT;
            }
            
             if(this.playerHitBottom(p)) {
                p.y = 0 - 28;
            }
            
            p.move(dt);
        },
            
              moveCircles: function(dt){
        for(var i=0;i<this.circles.length; i++){
            var c = this.circles[i];
            c.move(dt);
            
            if(this.circleHitLeftRight(c)) {
                c.xSpeed *= -1;
                c.move(dt);
            }
            if(this.circleHitTopBottom(c)){ 
                c.ySpeed *= -1;
                 c.move(dt);
            }
        }
    }, 
    
//-------------Collison Detection ------------------------------------------------------------------
    circleHitLeftRight: function (c){
        if (c.x <= c.radius || c.x >= this.WIDTH - c.radius){
            return true;
        }
    },
    
    circleHitTopBottom: function (c){
        if (c.y < c.radius || c.y > this.HEIGHT - c.radius){
            return true;
        }
    }, 
    
    
    playerHitLeft: function(p){
      if(p.x < 0-28){
         return true;
      }  
    },
    
    playerHitRight: function(p){
      if(p.x > this.WIDTH){
         return true;
      }  
    },
    
    playerHitTop: function(p){
      if(p.y < 0 - 28){
         return true;
      }  
    },
    
    playerHitBottom: function(p){
      if(p.y > this.HEIGHT){
         return true;
      }  
    },
    /*
    playerHitCircle(p, c){
        var p = this.player;
        for(var i = 0; i < this.circles.length; i++){
            var c = circles[i];
            
            if(c.x ){
                
            }
        }
    },
   */
 
    
    update : function() {
        
    this.animationID = requestAnimationFrame(this.update.bind(this));
    
         
        this.dt = this.calculateDeltaTime();
    this.ctx.fillStyle = "#66CCFF";
    this.ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);
    
        this.ctx.restore();
        
    this.drawPlayer(this.ctx);
        this.movePlayer(this.dt);
        this.drawCircles(this.ctx);
        this.moveCircles(this.dt);
       
     this.detectCollision();  
     this.gameHUD();
        
},
    
    detectCollision : function()
    {
        
        var collide = false;
        var c1 = this.player;
        var pX = c1.x + 15;
        var pY = c1.y + 15;
        var halfWidth = c1.width/2;

          for(var i=0;i<this.circles.length; i++){
                var c2 = this.circles[i];    

                var dx = Math.abs(c2.x  - pX);
                var dy = Math.abs(c2.y  - pY);
              var corners = (dx - halfWidth)^2 + (dy - halfWidth)^2;
              
                    
              
              if(dx > (halfWidth + c2.radius)){collide = false};
              if(dy > (halfWidth + c2.radius)){collide = false};
    
                console.log(dx,dy,c1.x,c1.y,c2.x,c2.y);
              
              if(dx <= (halfWidth*2) && dy <= (halfWidth*2) && corners <= (c2.radius^2)) {collide = true;}
            

            
                        if(collide == true){
                           
                            this.gameEnd(); 
                            c2.xSpeed = c2.ySpeed = 0; 
                            alert(dx + " " + dy + " " +  c1.x + " " + c1.y + " " + c2.x + " " + c2.y);
                            break;                       
                        }
                        else(this.score++);
                    
                
            }

},

gameEnd: function(ctx){
        
        //alert("Game Over!!");
       
    },

gameHUD: function(ctx){
   
},

    calculateDeltaTime: function(){
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	} 
    
};
