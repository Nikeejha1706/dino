var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var backgroundImage;



function preload(){
  trex_running =   loadAnimation("dino-removebg-preview.png","dianasaur_2-removebg-preview.png","dino3-removebg-preview.png");
  trex_collided = loadAnimation("dino_collided-removebg-preview.png");
  
  groundImage = loadImage("ground2.png");
  
  backgroundImage = loadImage("ground.jpg");
  
  cloudImage = loadImage("cloud-removebg-preview.png");
  
  obstacle1 = loadImage("cactu-removebg-preview.png");
  obstacle2 = loadImage("cactus2-removebg-preview.png");
  obstacle3 = loadImage("cactus3-removebg-preview.png");
  obstacle4 = loadImage("cactus_4-removebg-preview.png");
  obstacle5 = loadImage("cactus_5-removebg-preview.png");
  obstacle6 = loadImage("cactus_6-removebg-preview.png");
  
  gameOverImg = loadImage("gameoverpng-removebg-preview.png");
  restartImg = loadImage("restart.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  //creating background
  background = createSprite(0,0,600,200);
  background.addImage(backgroundImage);
  background.scale = 3.5
  
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  
  ground = createSprite(200,190,400,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.6;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  trex.debug = true;
  trex.setCollider("circle",0,0,85);
  
  
  score = 0;
}

function draw() {
  //trex.debug = true;
 // background(255);
  text("Score: "+ score, 500,50);
  textSize(50);
  
  
  if (gameState===PLAY){
    score.visible = true;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(500,120,40,10);
    cloud.y = Math.round(random(0,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,400,10);
obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}