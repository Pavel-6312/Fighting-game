class Enemy extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.enemy = config.scene.enemy;

        this.enemy = this.physics.add.sprite(game.config.width*0.5,game.config.height/2, 'p2-walk')

        // this.add(this.enemy);
        this.scene.add.existing(this);

        this.enemy.setCollideWorldBounds(true);
        this.enemy.body.setSize(16, 48, 8, 24);
        enemyHp=20;     

        this.physics.add.collider(enemy, platforms);
        this.physics.add.collider(this.enemy, platforms);

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
    }
}

// class EnemyImages extends Phaser.GameObjects.Container
// {
//     constructor(config)
//     {
//         super(config.scene);
//         this.scene = config.scene;
//         this.physics = config.scene.physics;
//         this.anims = config.scene.anims;
//         this.platforms = config.scene.platforms;
//         this.enemy = config.scene.enemy;

//         //Follow left
//         if (distance < -21) 
//         {
//             enemy.setVelocityX(-180);
//             enemy.anims.play('p2-walk', true).setFlipX(false); 
//         } 

//         //Follow right
//         else if (distance > 20) 
//         {
//             enemy.setVelocityX(180);
//             enemy.anims.play('p2-walk', true).setFlipX(true);
//         }
//     }
// }

// class EnemyPreload extends Phaser.GameObject.Container
// {
//     constructor(config)
//     {
//         super(config.scene);
//         this.scene = config.scene;
//         this.physics = config.scene.physics;
//         this.anims = config.scene.anims;
//         this.platforms = config.scene.platforms;
//         this.enemy = config.scene.enemy;
        
//         this.load.spritesheet('p2-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png', {frameWidth: 48,frameHeight: 48,});
//         this.load.spritesheet('p2-idle', 'assets/desert-enemy/5 Mummy/Mummy_idle.png', {frameWidth: 48,frameHeight: 48,});
//         this.load.spritesheet('p2-attack', 'assets/desert-enemy/5 Mummy/Mummy_attack.png', {frameWidth: 48,frameHeight: 48,});

//     }
// }
