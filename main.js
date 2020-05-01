var config = {
        type: Phaser.AUTO,
        width: 400,
        height: 180,
        backgroundColor: 0xf1f1f1,
        pixelArt: true,
        zoom: 1.5,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 500},
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

// Variables
var game = new Phaser.Game(config);


var player;
var cursors;
var platforms;

function preload (){
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('p1-idle', 'assets/desert-enemy/5 Mummy/Mummy_idle.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-death', 'assets/desert-enemy/5 Mummy/Mummy_death.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-attack', 'assets/desert-enemy/5 Mummy/Mummy_attack.png', {frameWidth: 48, frameHeight: 48,})
    this.load.spritesheet('p1-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png', {frameWidth: 48, frameHeight: 48,})

}

function create (){
//Environment
    platforms = this.physics.add.staticGroup();
    platforms.create(406, 180, 'ground');

// Player
    player = this.physics.add.sprite(200, 40, 'p1-idle');
    player.setCollideWorldBounds(true);
    player.body.setGravityY(500);
    
    this.anims.create({
            key: 'p1-idle',
            frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
            frameRate: 10,
        });

    this.anims.create({
            key: 'p1-death',
            frames: this.anims.generateFrameNumbers('p1-death', { start: 0, end: 6 }),
            frameRate: 10,
        });
    
    this.anims.create({
            key: 'p1-attack',
            frames: this.anims.generateFrameNumbers('p1-attack', { start: 3, end: 6 }),
            frameRate: 10,
        });

    this.anims.create({
            key: 'p1-walk',
            frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
            frameRate: 10,
        });

// Collider
    this.physics.add.collider(player, platforms);

// Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    
}

function update (){

//     const conditionsArray = [
//     condition1, 
//     condition2,
//     condition3,
// ]

// if (conditionsArray.indexOf(false) === -1) {
//     "do somthing"
// }

    if (cursors.left.isDown) {
        player.setVelocityX(-240);
        player.anims.play('p1-walk', true).setFlipX(false);
    } 

    else if (cursors.right.isDown) {
        player.setVelocityX(240);
        player.anims.play('p1-walk', true).setFlipX(true);
    } 

    else if (cursors.down.isDown) {
        player.setVelocityY(400);  
        player.anims.play('p1-death', true); 
    } 

    else {
        player.setVelocityX(0);
        player.anims.play('p1-idle', true);

    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-550);
        
    }
    
    else if (cursors.space.isDown) {
        player.anims.play('p1-attack', true);
    }

    

    

}