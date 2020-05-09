//This goes to PRELOAD
class EnemyPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
        this.load.spritesheet('p2-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p2-idle', 'assets/desert-enemy/5 Mummy/Mummy_idle.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p2-attack', 'assets/desert-enemy/5 Mummy/Mummy_attack.png', {frameWidth: 48,frameHeight: 48,});

        this.load.spritesheet('e-idle', 'assets/e-idle.png', {frameWidth: 96, frameHeight: 96,})

    }
}

//This goes to CREATE
class EnemyCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.enemy = config.scene.enemy;
        enemy = this.physics.add.sprite(game.config.width*0.62+1,game.config.height/2, 'e-idle');
    
        enemy.setCollideWorldBounds(true);
        // enemy.body.setSize(16, 48, 8, 24);
        enemyHp=20;     

        //Weapon
        enemyW = this.physics.add.sprite(enemy.x, enemy.y, 'weapon');
        enemyW.body.setAllowGravity(false);
        enemyW.setAlpha(0);
        
        this.physics.add.collider(enemy, platforms);

        this.anims.create({
            key: 'p2-walk',
            frames: this.anims.generateFrameNumbers('p2-walk', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

        this.anims.create({
            key: 'e-idle',
            frames: this.anims.generateFrameNumbers('e-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

        enemy.anims.play('e-idle', false);

        this.anims.create({
            key: 'p2-attack',
            frames: this.anims.generateFrameNumbers('p2-attack', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });        
    }
};

//This goes to UPDATE
class EnemyUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.enemy = config.scene.enemy;
        
        //Enemy movement
        
        distance = player.x - enemy.x;
        enemyW.x=enemy.x;
        enemyW.y=enemy.y; 
        var weaponRange = 24; 
        enemyW.body.setSize(1, 1, 1, 1  );

        //Follow left
        if (distance < -21) 
        {
            enemy.setVelocityX(-180);
            enemy.anims.play('p2-walk', true).setFlipX(false); 
        } 

        //Follow right
        else if (distance > 20) 
        {
            enemy.setVelocityX(180);
            enemy.anims.play('p2-walk', true).setFlipX(true);
        } 

        //Idle / Attack


        else 
        {
            enemy.setVelocityX(0);
            enemy.anims.play('p2-idle',true); 
            // enemy.anims.play('p2-attack',true); 
    
                if (enemy.flipX == false)
                {
                    weaponRange = weaponRange * -1
                    enemyW.x = enemy.x + weaponRange; 
                }
                else {
                    enemyW.x = enemy.x + weaponRange;  
                }
                    enemyW.body.setSize(24, 8, 8, 12);
                    enemyW.setAlpha(1);
            
            // if (Date.now() < lastHitTimeEnemy + 1000 == true)
            // {
            //     if (enemy.flipX == false)
            //     {
            //         weaponRange = weaponRange * -1
            //         enemyW.x = enemy.x + weaponRange; 
            //     }
            //     else {
            //         enemyW.x = enemy.x + weaponRange;  
            //     }
            //     enemyW.body.setSize(24, 8, 8, 12);
            //     enemyW.setAlpha(1);
            // }

            if (Date.now() < lastHitTimeEnemy + 1000/30 == true)
            {
                enemyW.body.setSize(1, 1, 1, 1  ) ;
                enemyW.x=enemy.x;
                enemyW.setAlpha(0);
            }
        }

        // Jump if blocked
        if (enemy.body.blocked.left==true || enemy.body.blocked.right==true) 
        {
            enemy.setVelocityY(-240);
        }

        
        

    }
}


