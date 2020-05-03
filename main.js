var config = {
        type: Phaser.AUTO,
        width: 684,
        height: 300,
        parent: 'game1', //canvas parent id
        backgroundColor: 0xffffff,
        pixelArt: true, //fix blurred pixels
        zoom: 1,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 1200},
                debug: true
            }
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };

var game = new Phaser.Game(config);
var player;
var enemy;
var cursors;
var platforms;
var rNum;
var distance;
var speed;

function preload()
{
//Ground
    this.load.image('platform', 'assets/platform.png');
    this.load.image('platform-sm', 'assets/platform-sm.png');
//Player
    this.load.spritesheet('p1-idle', 'assets/character/2 GraveRobber/GraveRobber_idle.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-attack', 'assets/character/2 GraveRobber/GraveRobber_attack1.png', {frameWidth: 48, frameHeight: 48,})
    this.load.spritesheet('p1-walk', 'assets/character/2 GraveRobber/GraveRobber_run.png', {frameWidth: 48, frameHeight: 48,})
    this.load.spritesheet('p1-jump', 'assets/character/2 GraveRobber/GraveRobber_jump.png', {frameWidth: 48, frameHeight: 48,})

//Enemy
    this.load.spritesheet('p2-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p2-idle', 'assets/desert-enemy/5 Mummy/Mummy_idle.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p2-attack', 'assets/desert-enemy/5 Mummy/Mummy_attack.png', {frameWidth: 48,frameHeight: 48,});
}

function create()
{
    
//Environment
    platforms = this.physics.add.staticGroup(); //Adds ground 
    platforms.create(300, 284, 'platform'); //Places ground sprite

    platforms.create(game.config.width/2+38, 252, 'platform-sm');
    platforms.create(game.config.width/2-38, 140, 'platform-sm');
 
//Enemy
    enemy = this.physics.add.sprite(game.config.width*0.75,game.config.height/2, 'p2-walk')
    enemy.setCollideWorldBounds(true);
    enemy.body.setSize(16, 48, 8, 24);

    this.anims.create({
        key: 'p2-walk',
        frames: this.anims.generateFrameNumbers('p2-walk', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: -1 // -1 run forever / 1 -> run once
    });

    this.anims.create({
        key: 'p2-idle',
        frames: this.anims.generateFrameNumbers('p2-idle', { start: 0, end: 4 }),
        frameRate: 6,
        repeat: -1 // -1 run forever / 1 -> run once
    });

    this.anims.create({
        key: 'p2-attack',
        frames: this.anims.generateFrameNumbers('p2-attack', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: -1 // -1 run forever / 1 -> run once
    });

//Player
    player = this.physics.add.sprite(game.config.width*0.25, game.config.height/2, 'p1-idle');
    player.setCollideWorldBounds(true);
    player.body.setSize(16, 48, 8, 24);// x, y, offset x, offset y
    
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
            frames: this.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
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

//Collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);

//Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

}

//Generate random number
// setInterval(function(){
//     rNum = Phaser.Math.Between(0,300);
    
// }, 1000);

function update ()
{

//Player movement
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

//Enemy movement
    
     distance = player.x - enemy.x;

    //Follow left
    if (distance < -21) 
    {
        enemy.setVelocityX(-100);
        enemy.anims.play('p2-walk', true).setFlipX(false); 
    } 

    //Follow right
    else if (distance > 20) 
    {
        enemy.setVelocityX(100);
        enemy.anims.play('p2-walk', true).setFlipX(true);
    } 

    //Idle
    else 
    {
        enemy.setVelocityX(0);
        enemy.anims.play('p2-idle',true); 
        // enemy.anims.play('p2-attack',true);    
    }

    //Jump if blocked
    if (enemy.body.blocked.left==true || enemy.body.blocked.right==true) 
    {
        enemy.setVelocityY(-240);
    }
  
}

