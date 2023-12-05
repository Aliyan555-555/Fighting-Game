const canvas = document.querySelector("canvas");
const body = document.querySelector("body");
body.style.padding = 0;
body.style.margin = 0;
body.style.overflow = "hidden";
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 550;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 10;
const key = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  Arrowleft: {
    pressed: false,
  },
  Arrowright: {
    pressed: false,
  },
  Arrowup: {
    pressed: false,
  },
};
var Lastkey;
var Lastkey1;
 class Background{
  constructor({position,ImageSrc,scale = 1,frames=1,offset={x:0,y:0}}){
    this.position=position
    this.image=new Image()
    this.image.src = ImageSrc
    this.width=50
    this.height=150
    this.scale=scale
    this.frames=frames
    this.CureentFrames=0
    this.FrameElapsed=0
    this.FrameHold=5
    this.offset=offset
  }
  draw(){
    c.drawImage(
      this.image,
      this.CureentFrames * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      this.image.width / this.frames * this.scale,
      this.image.height * this.scale
      )
  }
  anmateFrame(){
    this.FrameElapsed++
    if (this.FrameElapsed % this.FrameHold === 0) {
      
      if(this.CureentFrames < this.frames -1){
        this.CureentFrames++
        
      }else{
        this.CureentFrames=0
      }
    }
  }
  update(){
    this.draw()
    this.anmateFrame()
  }
 }
class Sprite extends Background {
  constructor({ position, velocity ,ImageSrc,scale = 1,frames=1,offset={x:0,y:0},sprites,attackbox = {offset:{},width:undefined, height:undefined}}) {
    super({
      position,
      scale,
      frames,
      ImageSrc
      ,offset
    })

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.isAttacking;
    this.Lastkey;
    
    this.CureentFrames=0;
    this.FrameElapsed=0;
    this.FrameHold=5;
    this.sprites=sprites
    for (const sprite in this.sprites) {
    sprites[sprite].image = new Image()
    sprites[sprite].image.src = sprites[sprite].imageSrc

  }
    this.helth = 100,
    this.death=false,
      (this.attackbox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        width: attackbox.width,
        offset: attackbox.offset,
        height: attackbox.height,
      });
  }
  
  // draw() {
  //   c.fillStyle = "red";
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height);
  //   c.fillStyle = "blue";
  //   c.fillRect(
  //     this.attackbox.position.x,
  //     this.attackbox.position.y,
  //     this.attackbox.width,
  //     this.attackbox.height
  //   );
  // }
  update() {
    this.draw();
   if(!this.death) this.anmateFrame()
    this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
    this.attackbox.position.y = this.position.y + this.attackbox.offset.y
    // c.fillRect(
    //   this.attackbox.position.x,
    //   this.attackbox.position.y,
    //   this.attackbox.width,
    //   this.attackbox.height
    // )

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 100) {
      this.velocity.y = 0;
    } else {
      this.velocity.y = gravity;
    }
  }
  takehit(){
    if (this.helth <= 0) {
      this.swichSprite('deth')
    }else {
    this.helth -= .5
    this.swichSprite('takehit')
    }
  }
  attacking() {
    this.swichSprite('attack')
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 800);
  }
  swichSprite(sprite){
if (this.image ===  this.sprites.attack.image && this.CureentFrames < this.sprites.attack.frames -1 ) return
if (this.image ===  this.sprites.takehit.image && this.CureentFrames < this.sprites.takehit.frames -1 ) return
if (this.image ===  this.sprites.deth.image ){
  if (this.CureentFrames === this.sprites.deth.frames -1) this.death=true
return
}
if (!this.death) {
  

    switch (sprite) {
      case 'idle':
        if(this.image !== this.sprites.idle.image){
          this.image = this.sprites.idle.image
          this.frames = this.sprites.idle.frames;
        }
        break;
    case 'run':
      if(this.image !== this.sprites.run.image){
        this.image = this.sprites.run.image
        this.frames = this.sprites.run.frames;
      }
    break;
    case 'jump':
      if (this.image !== this.sprites.jump.image) {
         this.image = this.sprites.jump.image;
     this.frames = this.sprites.jump.frames;
      }
    

      break;
    case 'fall':
      if (this.image !== this.sprites.fall.image) {
        this.image = this.sprites.fall.image;
     this.frames = this.sprites.fall.frames;
      }
  break;
    case 'attack':
      if (this.image !== this.sprites.attack.image) {
        this.image = this.sprites.attack.image;
     this.frames = this.sprites.attack.frames;
      }
  break;
    case 'deth':
      if (this.image !== this.sprites.deth.image) {
        this.image = this.sprites.deth.image;
     this.frames = this.sprites.deth.frames;
      }
  break;
    case 'takehit':
      if (this.image !== this.sprites.takehit.image) {
        this.image = this.sprites.takehit.image;
     this.frames = this.sprites.takehit.frames;
      }
  break;
      
    }}
  }
}
const background = new Background({
  position:{
    x:0,
    y:0
  },
  scale:1,
  ImageSrc:'/background.png'
})
const Shop = new Background({
  position:{
    x:650,
    y:160
  },
  frames:6,
  scale:2.50,
  ImageSrc:'/shop_anim.png'
})
const player = new Sprite({
  position: {
    x: 0,
    y:0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 250,
    y: 180,
  },
  ImageSrc:'/player2/Idle.png',
  frames:8,
  scale:3,
  sprites:{
    idle:{
      imageSrc:'/player2/Idle.png',
      frames:8
},
run:{
  imageSrc:'/player2/Run.png',
  frames:8
},
jump:{
  imageSrc:'/player2/Jump.png',
  frames:2
},
fall:{
  imageSrc:'/player2/Fall.png',
  frames:2
},
attack:{
  imageSrc:'/player2/Attack2.png',
  frames:6
}
,
deth:{
  imageSrc:'/player2/Death.png',
  frames:6
},
takehit:{
  imageSrc:'/player2/Take2.png',
  frames:4
}
    
  }
  ,
  attackbox:{
    offset:{
      x:50,y:0
    },
    width:150,height:100
  }
});
const enemy = new Sprite({
  position: {
    x: 900,
    y: -15,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 250,
    y: 200,
  },
  ImageSrc:'/player1/Idle.png',
  frames:4,
  scale:3,
  sprites:{
    idle:{
      imageSrc:'/player1/Idle.png',
      frames:4
},
run:{
  imageSrc:'/player1/Run.png',
  frames:8
},
jump:{
  imageSrc:'/player1/Jump.png',
  frames:2
},
fall:{
  imageSrc:'/player1/Fall.png',
  frames:2
},
attack:{
  imageSrc:'/player1/Attack2.png',
  frames:4
},
deth:{
  imageSrc:'/player1/Death.png',
  frames:7
},
takehit:{
  imageSrc:'/player1/Take.png',
  frames:3
}
}
,
attackbox:{
  offset:{
    x:-100,y:0
  },
  width:150,height:100
}
})

window.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (!player.death) {
    
  
  switch (e.key) {
    case "a":
      player.Lastkey = "a";
      key.a.pressed = true;
      break;
    case "d":
      player.Lastkey = "d";
      key.d.pressed = true;
      break;
    case "w":
      player.velocity.y = -300;
      break;
      case "s":
        player.attacking();
        
        break;
    
  }}
  if (!enemy.death) {
    
 
  switch (e.key) {
    case "ArrowLeft":
      enemy.Lastkey = "ArrowLeft";
      key.Arrowleft.pressed = true;
      break;
    case "ArrowRight":
      enemy.Lastkey = "ArrowRight";
      key.Arrowright.pressed = true;
      break;
    case "ArrowDown":
      enemy.attacking();
      break;
    case "ArrowUp":
      enemy.velocity.y = -300;
      break;
  } }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      key.d.pressed = false;

      break;
    case "a":
      key.a.pressed = false;

      break;
    case "ArrowUp":
      enemy.velocity.y=0
      break;
  }
  switch (e.key) {
    case "ArrowRight":
      key.Arrowright.pressed = false;

      break;
    case "ArrowLeft":
      key.Arrowleft.pressed = false;

      break;
    case "w":
      player.velocity.y=0
      break;
  }
});
function Colision({ player1, player2 }) {
  return (
    player1.attackbox.position.x + player1.attackbox.width >=
      player2.attackbox.position.x && player1.attackbox.position.x <=
      player2.attackbox.position.x + player2.attackbox.width && player1.attackbox.position.y + player1.attackbox.height >= player2.position.y && player1.attackbox.position.y <=player2.attackbox.position.y + player2.attackbox.height
  );
}

function animation() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animation);
  background.update()
  Shop.update()
  enemy.update();
  player.update();
  if (
    Colision({
      player1: player,
      player2: enemy,
    }) &&
    player.isAttacking && player.CureentFrames === 4
  ) {

    gsap.to('#enemyhelth',{
      width:enemy.helth + '%'
    })
    enemy.takehit()

  }
  if (
    Colision({
      player1: enemy,
      player2: player,
    }) &&
    enemy.isAttacking && enemy.CureentFrames === 2
  ) {
   
    gsap.to('#playerhelth',{
      width:player.helth + '%'
    })
    player.takehit()
  }
 
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player Movement
  player.swichSprite('idle')
  enemy.swichSprite('idle')
  if (key.a.pressed && player.Lastkey === "a") {
    player.velocity.x = -5;
    player.swichSprite('run')
  } else if (key.d.pressed && player.Lastkey === "d") {
    player.velocity.x = 5;
   player.swichSprite('run')
  }
 if (player.helth === 0) {
  player.swichSprite('deth')
 }
  if (player.velocity.y < 0) {
    player.swichSprite('jump')
    player.frames= player.sprites.jump.frames
  }else if(player.velocity.y === gravity){
    player.swichSprite('fall')
  }
  const winbox= document.getElementById('winbox')
if (player.helth===0) {
  winbox.style.display='flex'
  winbox.innerText= 'Player Two Win'
}
  
if (enemy.helth===0) {
  winbox.style.display='flex'
  winbox.innerText= 'Player One Win'
}
  
  if (key.Arrowleft.pressed && enemy.Lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.swichSprite('run')
  }else if (key.Arrowright.pressed && enemy.Lastkey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.swichSprite('run')
  } 
  if (enemy.velocity.y === gravity) {
     enemy.swichSprite('fall')
    console.log(enemy.velocity.y)
  }else if(enemy.velocity.y > 0){
   enemy.swichSprite('jump')
  }
  if (enemy.helth===0) {
    enemy.swichSprite('deth')
  }
}
animation();
