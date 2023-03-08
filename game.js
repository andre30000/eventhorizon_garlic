// wouldnt hurt to review 25min-37
// url for sprite image: https://raw.githubusercontent.com/CodeExplainedRepo/Original-Flappy-bird-JavaScript/master/img/sprite.png
// check the fg+bg y attribute - why cvs.height-255??
// confirm able to find x,y png coordinates
// whats going on with bird object? bird.sX vs this.sX? x and y being halved by width/height?
// check the welcome message centering
// check controlling the game to make sure you understand
// look up "switch" javascript 
// also prob review "case"
// check parseInt documentation?

// why break in the game state case?


// SELECT CVS

const cvs = document.getElementById("bird"); //from html
const ctx = cvs.getContext("2d"); //this is a standard html thing needed for animation or something?

// GAVE VARS AND CONSTS
let frames = 0; //set to 0, frames needed for animation
const DEGREE = Math.PI/180; //this creates the degree function for converting degrees into radians for the bird rotation

// LOAD SPRITE IMAGE
const sprite = new Image();//making new const
sprite.src = "img/sprite.png";//setting the source of the sprite

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// START BUTTON COORD
const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
}

//GAME STATE definitions
const state = {
  current: 0,
  getReady: 0,     //tells the machine what graphics to show based on which game state the game is in
  game: 1,
  over: 2
}

// CONTROLLING THE GAME
cvs.addEventListener("click", function(evt){ //listens for clicks 
  switch(state.current){        //switches between cases - use instead of if/then?
    case state.getReady:        //if the state is getReady, and it hears a click, 
      state.current = state.game;       //then the current state changes to game
      SWOOSHING.play();
      break;          //why this here
    case state.game:      //if the game state is 'game', the bird will flap on clicks
        if(bird.y - bird.radius <= 0) return; // THIS IS SOMETHING THAT WAS ADDED IN THE YOUTUBE COMMENTS WTF? it is in the github code
        bird.flap();
        FLAP.play();
        break;        //why this here
    case state.over:      //if the game state is 'over', then a click will make the current state = getReady to bring back to welcome screen
        let rect = cvs.getBoundingClientRect(); // this method keeps track of the boundaries of the canvas in case the window is scrolled, which would move the xy position of the start button
        let clickX = evt.clientX - rect.left; // these both keep track of the clicking in relation to the canvas movement. 
        let clickY = evt.clientY - rect.top; // rewatch logic section around 1hr25min

        // CHECK IF WE CLICK ON THE START BUTTON
        if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
          pipes.reset();
          bird.speedReset();
          score.reset();
          state.current = state.getReady;
        }
        
        // the code above describes the exact position of the start button on the game over screen
        
        break;
  }          
});

//BACKGROUND object - from sprite
const bg = {
  sX : 0, //sX = source X. x point where image begins on sprite.png
  sY : 0, //sY - same thing but y
  w : 275, //width in pixels in source png DOUBLE CHECK HOW TO FIND THIS
  h : 226, //height in pixels in source png SAME
  x : 0, //destination x
  y : cvs.height - 226, //CHECK THIS why subtract?
  
  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);//this enables drawing the background image from png
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);//this doubles the background starting at x + width bc image is smaller than canvas
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y - 226, this.w, this.h);// doubles the background above the spacey foreground
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y - 226, this.w, this.h);// same but makes it wide enough

  }
}


//FOREGROUND object
const fg = { //see comments from BACKGROUND, same deal
 sX : 276,
 sY : 0,
 w : 224,
 h : 112,
 x : 0,
 y : cvs.height - 332,

 dx : 0, //delta x, sets movement rate for foreground to move while flapping
 
 draw : function(){
   ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);//same deal as background
   ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);//doubles to fit x
 },

 update: function(){
   if(state.current == state.game){
     this.x = (this.x - this.dx)%(this.w/2); //this moves the foreground while in game state. re-learn modular thing
   }
 }
} 


//FOREGROUND object
const sunburst = { 
  sX : 400,
  sY : 290,
  w : 100,
  h : 100,
  x : 0,
  y : cvs.height - 90,
 
  //dx : 0, //delta x, sets movement rate for foreground to move while flapping
  
  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 230, this.y, this.w, this.h);//same deal as background
  //  ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);//doubles to fit x
  },
 
  /*
  update: function(){
    if(state.current == state.game){
      this.x = (this.x - this.dx)%(this.w/2); //this moves the foreground while in game state. re-learn modular thing
    }
  }*/
 } 


//SIDEWALL object
const sidewall = { //see comments from BACKGROUND, same deal
  sX : 540,
  sY : 25,
  w : 10,
  h : 300,
  x : 0,
  y : 0,
 
  dy : 2, //delta y, sets movement rate for sidewall to move during motion
  
  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);//draws the left sidewall
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y + 150, this.w, this.h);//draws the left sidewall - extends the length (y)

    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (cvs.width - this.w), this.y, this.w, this.h);//draws the right sidewall
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (cvs.width - this.w), this.y +150, this.w, this.h);//draws the right sidewall extends the length

  },
 
  update: function(){
    if(state.current == state.game){
      this.y = (this.y - this.dy)%(this.w/2); //this moves the sidewall while in game state. re-learn modular thing
    }
  }
 }

// BIRD object
const bird = {
  animation : [
    {sX: 284, sY: 113},
    {sX: 284, sY: 150},
    {sX: 284, sY: 188},
    {sX: 284, sY: 150},
  ],
  x: 130, // !!make sure to match the reset position beloW!
  y: 300,
  w: 26,
  h: 34,
  radius: 12,
  
  frame: 0,

  gravity: 0.25, //zero for test purposes
  jump: 4.6,
  speed: 0,
  rotation: 0,
  
  draw : function(){
    let bird = this.animation[this.frame];
    
    //see 53:00ish for info about the canvas rotation
    ctx.save(); //this saves the canvas state. this is necessary for rotating the bird. The canvas rotates, not the bird. Saiving the canvas keeps it so not eveerything rotates too
    ctx.translate(this.x, this.y); //moves the rotation point of the canvas from the origin (0,0) to the bird
    ctx.rotate(this.rotation);

    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h); //why bird and not this for sX and sY? - i think bc you want the image from the animation frame, not from the sprite location?? also, why w/2 and h/2? update: halving centers the bird

    ctx.restore();//restores the canvas to the save state above
  },

  flap : function(){
    this.speed = - this.jump;

  },

  update: function(){
    this.period = state.current == state.getReady ? 10 : 5; //this makes the flap period 10 on Ready screen, 5 during playtime
    //around 32:00 min mark explaning the modular % sign details
    // WE INCREMENT THE FRAME BY 1 EACH PERIOD
    this.frame += frames%this.period == 0 ? 1 : 0; //whats up with this formatting? at ~35 min
    //also gotta modularize the bird flap animation with % 4 - defined by animation.length (4 frames in the animation array of the bird flap)
    this.frame = this.frame%this.animation.length;

    if(state.current == state.getReady){
      
      this.x = 130; //  !! this hsould match initial x above! resets position of the bird after game over
      this.y = 300;
      this.rotation = 0 * DEGREE;
    }else{
      this.speed += this.gravity; //this sets the movement of the bird based on the gravity factor compounding
      this.x += this.speed; //location of bird based on speed


      this.y += this.speed/2;
      
      
      
      
      
      // THIS IS when the player hits the floor
      if(this.y + this.h/2 >= cvs.height){ //this function detects if the limits of the bird (y center plus half height) touches the bottom (canvas height - foreground height)
        this.y = cvs.height - fg.h - this.h/2;
        if(state.current == state.game){ //switches to game over when it detects collision 
          state.current = state.over; //use one equal sign to assign state, not check if values are equal
          DIE.play();
        }
      }
      //IF THE SPEED IS GREATER THAN the jump, means the bird is falling. bird is always either going up or down, so always rotate
      //
      if(this.speed >= this.jump){
        this.rotation = 90 * DEGREE;
        this.frame = 1; //this makes the bird stop flapping his wings when hes falling
      }else{
          this.rotation = -25 * DEGREE;
      }
    }
  },
  speedReset : function (){
    this.speed = 0;
  }
}

// GET READY MESSAGE objection
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width/2 - 173/2, //this centers get welcome message. how tho?
  y: 80,
  
  draw: function (){
    if(state.current == state.getReady){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
    }
}

// GEAME OVER MESSAGE object
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width/2 - 225/2, //this centers get welcome message. how tho?
  y: 90,
  
  draw: function (){
    if(state.current == state.over){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
  }
}


// function for random number generator, for barrier location below in the IF statement
function randomNumberForPipe(min, max){ 
  return Math.floor(Math.random() * (max -min +1)) + min;
}

//BARRIERS - "pipes" refer to the barriers which are the garlic asteroids - relic from flappy bird pipe
const pipes = {
  position : [], //makes an array to hold the multiple pipes

  top : {      //source image
    sX : 312,
    sY : 112
  },
  bottom : {
    sX: 312,
    sY: 158
  },

  w : 91,          //target
  h : 44,
  gap: 85,        //space between the pipes
  maxXPos : 20,   // maximum y position - double check this?
  dy : 2,     //this moves the pipes by 2 every frame

  draw : function(){                // draws pipes
    for (let i = 0; i < this.position.length; i++){    //loop
      let p = this.position[i];    

      let topXPos = p.x;    //defines the top pipe
      let bottomXPos = p.x + this.w + this.gap;   //defines the bottom pipe position based on height and gap of the top pipe

      //top pipe
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, topXPos, p.y, this.w, this.h);

      //bottom pipe
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, bottomXPos, p.y, this.w, this.h);
    }
  },

  //this makes sure the pipies only moving int he correct game state
  update: function(){
    if(state.current !== state.game) return;

    if(frames%100 == 0){      //not sure what this does, see the logic part around 1hr 5 min. i think it makes a new pipe every 100 frames
      this.position.push({
        x : this.maxXPos + randomNumberForPipe(-30, 30), // SEE above section for function for rando num
        y : 0
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];

      let rightPipeXPos = p.x + this.w + this.gap;

      // COLLISION DETECTION
      // top pipe
      if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
        state.current = state.over;
        HIT.play();
      }

        // bottom pipe
       if(bird.x + bird.radius > rightPipeXPos && bird.x - bird.radius < rightPipeXPos + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
          state.current = state.over;
          HIT.play();
        }
        p.y += this.dy; //decreases the x position by dx to move the pipe

      if(p.y + this.h >= 500){//delete the pipe form the array if it goes beyond the canvas - x position + width of the pipe
        this.position.shift();
        score.value += 1;
        SCORE_S.play();
        score.best = Math.max(score.value, score.best); //this determines if the "value" or "best" value is higher, then assigns it to best. Math.max takes the maximum value I suppose?
        localStorage.setItem("best", score.best);
      }
    }
  },
  reset : function(){
    this.position = [];
  }

}

//SCORE
const score = {
  best: parseInt(localStorage.getItem("best")) || 0, // this gets the best score from localstorage if there is one, if not the OR || returns 0. turns the value into an integer but I dont know why??
  value :0,

  draw: function(){
    ctx.fillStyle = "#FFF"; //this sets the text to white
    ctx.strokeStyle = "#000"; //sets outline

    if(state.current == state.game){ //score for in game
      ctx.lineWidth = 2;   //this makes it bold
      ctx.font = "35px Teko";   //sets size and font family
      ctx.fillText(this.value, cvs.width/2, 50);  //draws the number fill and sets the position in the middle (width/2), and 50 coordinates(pixels?) from the top
      ctx.strokeText(this.value, cvs.width/2, 50); //same but for the outline
    }else if(state.current == state.over){  //score for game over
      //SCORE VALUE
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186); //changes the position and height to fit in the box
      ctx.strokeText(this.value, 225, 186); //"" ""
      // BEST VALUE
      ctx.fillText(this.best, 225, 228); //changes the position and height to fit in the box
      ctx.strokeText(this.best, 225, 228); //"" ""

    }
  },
  reset : function(){
    this.value = 0;
  }
}


// DRAW 
function draw(){
  ctx.fillStyle = "#70c5ce"; //adds blue background behind everything - also clears canvas each fps
  ctx.fillRect(0, 0, cvs.width, cvs.height); //adds to canvas
  
  bg.draw(); //this actually draws background from what is above
  fg.draw();// this actually draws foreground

  sunburst.draw();

  pipes.draw();
  sidewall.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

// UPDATE
 function update(){
   bird.update();
   fg.update();
   pipes.update();
 }

// LOOP
function loop(){
  update();
  draw();
  frames++;
  
  requestAnimationFrame(loop);
}
loop();
