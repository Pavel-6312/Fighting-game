class SceneMain extends Phaser.Scene {
    constructor() 
    {
        super('SceneMain');
    }

    preload()
    {
    //Ground
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform-sm', 'assets/platform-sm.png');

    //Weapon
        this.load.image('weapon', 'assets/swamp/3 Objects/Pointers/7.png');

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

    create() 
    {
    //Environment
        platforms = this.physics.add.staticGroup(); //Adds ground 
        platforms.create(300, 284, 'platform'); //Places ground sprite
        platforms.create(game.config.width/2, 252, 'platform-sm');
        platforms.create(game.config.width/2-38, 140, 'platform-sm');
    
    //HP Txt
        playerHpText = this.add.text(20 ,20 ,'Start',{color:0xff0000});
        enemyHpText = this.add.text(200 ,20 ,'Start',{color:0xff0000});

    //Enemy
        enemy = this.physics.add.sprite(game.config.width*0.75,game.config.height/2, 'p2-walk')
        enemy.setCollideWorldBounds(true);
        enemy.body.setSize(16, 48, 8, 24);
        enemyHp=20;

        //Enemy weapon
        enemyW = this.physics.add.sprite(enemy.x, enemy.y, 'weapon');
        enemyW.body.setAllowGravity(false);

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
        playerHp=20;

    //Player weapon
        playerW = this.physics.add.sprite(player.x, player.y, 'weapon');
        playerW.body.setAllowGravity(false);


        //idle
        this.anims.create({
            key: 'p1-idle',
            frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
            frameRate: 6,
            });

        //death
        this.anims.create(
            {
                key: 'p1-death',
                frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 6 }),
                frameRate: 3,
                repeat: 1
            }
        );
        
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
                frameRate: 6,
            }); 

    //Collider
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemy, platforms);
        this.physics.add.overlap(enemyW, player, enemyHit.bind(this));
        this.physics.add.overlap(playerW, enemy, playerHit.bind(this));

    //Keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() 
    {
    //HP text
        playerHpText.setText('Player HP ' + playerHp);
        enemyHpText.setText('Enemy HP ' + enemyHp);

    //Player movement
        
        if(playerHp < 1 || enemyHp < 1)
        {
            this.scene.start('SceneTitle');
        }

        else
        {
            //Left  
            if (cursors.left.isDown && player.body.touching.down) 
            {
                player.setVelocityX(-240);
                player.anims.play('p1-walk', true).setFlipX(true);
            } 

            else if (cursors.left.isDown) 
            {
                player.setVelocityX(-240);
                player.anims.play('p1-jump', true).setFlipX(true);
            } 

            //Right
            else if (cursors.right.isDown && player.body.touching.down) 
            {
                player.setVelocityX(240);
                player.anims.play('p1-walk', true).setFlipX(false);
            } 

            else if (cursors.right.isDown) 
            {
                player.setVelocityX(240);
                player.anims.play('p1-jump', true).setFlipX(false);
            }

            //Down
            else if (cursors.down.isDown) 
            {
                player.setVelocityY(400);  
                player.anims.play('p1-death', true); 
            } 

            //Mid air
            else if (player.body.touching.down == false)
            {
                player.anims.play('p1-jump', true);
            }

            //Idle   
            else 
            {
                player.setVelocityX(0);
                player.anims.play('p1-idle', true);    
            }

            //Attack

            playerW.x=player.x;
            playerW.y=player.y; 
            playerW.body.setSize(1, 1, 1, 1  );

            if (cursors.space.isDown) 
            {
                player.anims.play('p1-attack', true);

                var weaponRange = 24; 
                
                if (player.flipX == true)
                {
                    weaponRange = weaponRange * -1
                    playerW.x = player.x + weaponRange; 
                }
                else {
                    playerW.x = player.x + weaponRange;  
                }
                 playerW.body.setSize(24, 8, 8, 12);
                        
            }

            if (cursors.space.getDuration()>1000/15)
            {
                playerW.body.setSize(1, 1, 1, 1  ) ;
                playerW.x=player.x;
            }

            //Jump
            if (cursors.up.isDown && player.body.touching.down) 
            {
                player.setVelocityY(-550);  
            }
        }

        if (Date.now() > lastHitTimeEnemy + 200 == true && playerHp > 5) 
        {
            player.clearTint()
        }
    
    //Enemy movement
        
        distance = player.x - enemy.x;
        enemyW.x=enemy.x;
        enemyW.y=enemy.y; 
        enemyW.body.setSize(1, 1, 1, 1  );

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

        //Idle / Attack

        
        else 
        {
            enemy.setVelocityX(0);
            // enemy.anims.play('p2-idle',true); 
            enemy.anims.play('p2-attack',true); 

            if (Date.now() > lastHitTimeEnemy + 1000/60 == true)
            {
            var weaponRange = 24; 
            
            if (enemy.flipX == false)
            {
                weaponRange = weaponRange * -1
                enemyW.x = enemy.x + weaponRange; 
            }
            else {
                enemyW.x = enemy.x + weaponRange;  
            }
                enemyW.body.setSize(24, 8, 8, 12);
                        
            
            }

            if (Date.now() < lastHitTimeEnemy + 1000/30 == true)
            {
                enemyW.body.setSize(1, 1, 1, 1  ) ;
                enemyW.x=enemy.x;
            }
        }

        //Jump if blocked
        if (enemy.body.blocked.left==true || enemy.body.blocked.right==true) 
        {
            enemy.setVelocityY(-240);
        }

        
    }

}

    function enemyHit (player)
    {
        if (Date.now() > lastHitTimeEnemy + 1000/30 == true) 
        {
            player.setTint(0xff0000);
            playerHp--;  
            lastHitTimeEnemy = Date.now()
        }
    }

    function playerHit (enemy)
    {
        if (Date.now() > lastHitTimePlayer + 1000/15 == true) 
        {
            enemy.setTint(0xff0000);
            enemyHp--;  
            lastHitTimePlayer = Date.now()
        }
    }

    //Generate random number
    // setInterval(function(){
    //     rNum = Phaser.Math.Between(0,300);
    // }, 1000);