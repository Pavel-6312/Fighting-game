var config = {
        type: Phaser.AUTO,
        width: 400,
        height: 300,
        parent: 'game1', //id that can be added to html tag to insert the game there
        backgroundColor: 0xffffff,
        pixelArt: true, //fix blurred pixels
        zoom: 1, //zoom th egame
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 1200},
                debug: false
            }
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };

// Variables (declare all variable that are used below)
var game = new Phaser.Game(config);
var player;
var cursors;
var platforms;
var group;
var char3;


function preload(){
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('p1-idle', 'assets/character/2 GraveRobber/GraveRobber_idle.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-attack', 'assets/character/2 GraveRobber/GraveRobber_attack3.png', {frameWidth: 48, frameHeight: 48,})
    this.load.spritesheet('p1-walk', 'assets/character/2 GraveRobber/GraveRobber_run.png', {frameWidth: 48, frameHeight: 48,})
    this.load.spritesheet('p1-jump', 'assets/character/2 GraveRobber/GraveRobber_jump.png', {frameWidth: 48, frameHeight: 48,})

    this.load.spritesheet('p2-walk', 'assets/desert-enemy/6 Deceased/Deceased_walk.png', {frameWidth: 48,frameHeight: 48,});

    this.load.spritesheet('p3-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png', {frameWidth: 48,frameHeight: 48,});
    
    this.load.audio('sound', 'assets/sound.wav');
}

function create(){
//Environment
    platforms = this.physics.add.staticGroup(); //Adds ground 
    platforms.create(300, 284, 'ground'); //Places ground sprite
 
//Enemy
    char2 = this.add.sprite(0,0, 'p2-walk')
    char2.setOrigin(0.5,0.5); //X Y Sets center point to the top left
    char2.y = game.config.height/2+70; //Center position
    char2.x = game.config.width/2+40;
    char2.alpha=1; //Transparency
    char2.angle=0; //Rotation
    char2.scaleX=2; //Scale
    char2.scaleY=1; 
    char2.scaleY = char2.scaleX; //Syncs scale values
    // char2.displayWidth=100; //Size in pixels
    // char2.displayHeight=100;

    this.anims.create({
        key: 'p2-walk',
        frames: this.anims.generateFrameNumbers('p2-walk', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: -1 // -1 run forever / 1 -> run once
    });

    char2.anims.play('p2-walk',true);

    char3 = this.physics.add.sprite(game.config.width, 200, 'p3-walk')

    this.anims.create({
        key: 'p3-walk',
        frames: this.anims.generateFrameNumbers('p3-walk', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: -1 // -1 run forever / 1 -> run once
    });

    char3.anims.play('p3-walk',true);

//Player
    player = this.physics.add.sprite(game.config.width/2-40, game.config.height/2, 'p1-idle'); //Places sprite in the center of the screen
    player.setCollideWorldBounds(true); //Collides with world bounds
    // player.body.setGravityY(1200); //Override gravity
    
    this.anims.create({
        key: 'p1-idle',
        frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
        frameRate: 6,
        });

    this.anims.create({
            key: 'p1-death',
            frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 1 }),
            frameRate: 3,
        });
    
    this.anims.create({
            key: 'p1-attack',
            frames: this.anims.generateFrameNumbers('p1-attack', { start: 4, end: 6 }),
            frameRate: 10,
        });

    this.anims.create({
            key: 'p1-walk',
            frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
            frameRate: 10,
        });
    
    this.anims.create({
            key: 'p1-jump',
            frames: this.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
            frameRate: 10,
        });
//Graphics
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(4,0xff0000);
    this.graphics.fillStyle(0xff0000, 0.5);
    this.graphics.moveTo(10,10);
    this.graphics.lineTo(80,10);
    this.graphics.strokePath();

    this.graphics.strokeRect(50,50,50,50);
    this.graphics.strokeCircle(150,150,10);
    this.graphics.fillCircle(150,150,10);
    
//Sound
    this.sound = this.sound.add('sound', {volume: 0.0});
    this.sound.play(); 

//Group of random objects
    group = this.add.group();

    for(var i = 0; i<5; i++){
        var x =Phaser.Math.Between(10,300);
        var y = Phaser.Math.Between(10,300);
        var char4 = this.physics.add.sprite(x , y, 'p2-walk');
        group.add(char4);
    }

//Collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(char3, platforms);

//Keyboard controls
    cursors = this.input.keyboard.createCursorKeys(); //enables keyboard input

// Tween function
    let boundFunc = doWalk.bind(this);
    boundFunc()
    
//Text
    this.text = this.add.text(game.config.width/2, 40, 'Text', {
        fontFamily:'Arial', 
        color:'#f1f1f1',
        fontSize:'40px'
        });
    this.text.setOrigin(0.5,0.5);
}

//Tween
function doWalk()
{
    this.tweens.add(
        {
            targets: char3, 
            duration: 5000, 
            x:0, 
            onComplete: onCompleteHandler,
            onCompleteParams: [this]
        });
}

function onDown(){
    this.platforms.alpha = 0.5;
}

function onCompleteHandler(tween, targets, scope) 
{
    var char3 = targets[0];
    char3.x = 400;
    let boundFunc = doWalk.bind(scope);
boundFunc()
}

function update (){

//Left  
    if (cursors.left.isDown && player.body.touching.down) {
        player.setVelocityX(-240);
        player.anims.play('p1-walk', true).setFlipX(true);
    } 

    else if (cursors.left.isDown) {
        player.setVelocityX(-240);
        player.anims.play('p1-jump', true).setFlipX(true);
    } 

//Right
    else if (cursors.right.isDown && player.body.touching.down) {
        player.setVelocityX(240);
        player.anims.play('p1-walk', true).setFlipX(false);
    } 

    else if (cursors.right.isDown) {
        player.setVelocityX(240);
        player.anims.play('p1-jump', true).setFlipX(false);
    }

//Down
    else if (cursors.down.isDown) {
        player.setVelocityY(400);  
        player.anims.play('p1-death', true); 
    } 

//Mid air
    else if (player.body.touching.down == false){
        player.anims.play('p1-jump', true);
    }

//Idle   
    else {
        player.setVelocityX(0);
        player.anims.play('p1-idle', true);
    }
 
//Attack   
    if (cursors.space.isDown) {
        player.anims.play('p1-attack', true);
    }

//Jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-550);  
    }

char2.x-=0.5; //Moves char2 by 1px to the left

if (char2.x < 0) { 
    char2.x = game.config.width; //If reches left border move to right border
}





    

 
}

