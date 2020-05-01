var config = {
        type: Phaser.AUTO,
        width: 812,
        height: 375,
        backgroundColor: 0xf1f1f1,
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

var map;
var player;
var cursors;
var groundLayer;
var text;


function preload (){
    // map
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/swamp/1 Tiles/Tileset.png', {frameWidth: 32, frameHeight: 32});

    this.load.spritesheet('p1-idle', '/assets/character/3 SteamMan/SteamMan_idle.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-death', '/assets/character/3 SteamMan/SteamMan_jump.png', {frameWidth: 48,frameHeight: 48,});
    this.load.spritesheet('p1-attack', '/assets/character/3 SteamMan/SteamMan_attack2.png', {frameWidth: 48, frameHeight: 48,})

}

function create (){
//Environment
    // load the map 
    map = this.make.tilemap({key: 'map'});
    
    // // tiles for the ground layer
    // var groundTiles = map.addTilesetImage('tiles');
    // // create the ground layer
    // groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // // the player will collide with this layer
    // groundLayer.setCollisionByExclusion([-1]);
 
    // // set the boundaries of our game world
    // this.physics.world.bounds.width = groundLayer.width;
    // this.physics.world.bounds.height = groundLayer.height;

// Player
    player = this.physics.add.sprite(390, 180, 'p1-idle');
    
    this.anims.create({
            key: 'p1-idle',
            frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0 
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

// Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    
}

function update (){

    if (cursors.down.isDown){
        player.anims.play('p1-death', true);

    } else if (cursors.left.isDown){
        player.anims.play('p1-attack', true);

    } else{
        player.anims.play('p1-idle', true);
    }

}