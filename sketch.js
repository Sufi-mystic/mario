var mario_running, mario, mario_collided, score;
var backImage, restartImg, ground, invisibleground, obstaclesGroup, bricksGroup, restart;
var dieSound, checkPointSound, jumpSound;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");

  groundImage = loadImage("ground2.png");

  backImage = loadImage("bg.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  brickImage = loadImage("brick.png");

  mario_collided = loadAnimation("collided.png");

  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 500);

  mario = createSprite(90, 400, 100, 100);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1.5;

  ground = createSprite(0, 460, 600, 200);
  ground.addImage(groundImage);


  invisibleground = createSprite(0, 432, 600, 10);
  invisibleground.visible = false;

  obstaclesGroup = new Group();
  bricksGroup = new Group();

  mario.setCollider("circle", 0, 0, 18);
  mario.debug = true;

  restart = createSprite(300, 250);
  restart.addImage(restartImg);
  restart.scale = 1;
  restart.visible = false;

  score = 0;
}

function draw() {
  background(backImage);

  if (gameState === PLAY) {
    //moving ground
    ground.velocityX = -(3 + score / 100);

    //resetting of the ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    //mario jumps when space key is pressed
    if (keyDown("space") && mario.y >= 370) {
      jumpSound.play();
      mario.velocityY = -15;
    }
    //creating gravity for Mario
    mario.velocityY = mario.velocityY + 0.8;

    //spawning obstacles
    spawnObstacle();
    spawnBricks();

    //score
    fill("white");
    textSize(22);
    text("Score : " + score, 400, 40);
    score = score + Math.round(getFrameRate()/60);

    //milestone
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    //mario collides with obstacle
    if (obstaclesGroup.isTouching(mario)) {
      //mario.velocityY = -12;
      dieSound.play();
      gameState = END;
    }

  } else if (gameState === END) {
    //stationary ground
    ground.velocityX = 0;

    //setting velocity to 0
    mario.velocityY = 0;

    //mario collides with obstacle
    mario.changeAnimation("collided", mario_collided);

    //setting velocities of each obstacle and brick to 0
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);

    //to make the obstacle and bricks stay even after game ends
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);

    //restart
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }

  }

  mario.collide(invisibleground);



  drawSprites();
}

function reset() {
  gameState = PLAY;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();

  mario.changeAnimation("running", mario_running);
  score = 0;
}


function spawnObstacle() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 395, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 100;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnBricks() {
  if (frameCount % 30 === 0) {
    var brick = createSprite(600, 200, 10, 40);
    brick.velocityX = -6;
    brick.y = Math.round(random(100, 200));
    brick.addImage(brickImage);
    //assign scale and lifetime to the brick           
    brick.scale = 1.5;
    brick.lifetime = 100;
    //add each brick to the group
    bricksGroup.add(brick);
  }
}