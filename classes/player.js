//preload
class PlayerPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
         //Player
        this.load.spritesheet('p1-move', 'assets/p-run.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-jump', 'assets/p-jump.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-idle', 'assets/p-idle.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-attack', 'assets/p-attack.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-block', 'assets/p-block.png', {frameWidth: 48, frameHeight: 48,})

        this.load.spritesheet('death', 'assets/desert-enemy/5 Mummy/Mummy_death.png', {frameWidth: 48, frameHeight: 48,})
    }
}

//create
class PlayerCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        //Varables for class
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.player = config.scene.player;
        this.enemy = config.scene.enemy;

        //Add player
        player = this.physics.add.sprite(game.config.width*0.25, 0, 'p1-idle');

        //Properties
        player.direction = 'right';
        // player.setCollideWorldBounds(true);
        player.body.setSize(16, 36, 1, 1);// X, Y, XYOffset

        playerAp= 3;
        generateActions();
        
        //Rec
        rectW = this.scene.add.graphics();
        rectW2 = this.scene.add.graphics();
        
        //Collider
        this.physics.add.collider(player, platforms);
        
        this.physics.add.collider(rectW, platforms);

        //Idle anim
        this.anims.create({
            key: 'p1-idle',
            frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });

        //Attack anim
        this.anims.create({
            key: 'p1-attack',
            frames: this.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
            frameRate: 10,
            repeat:0
        });

        //Walk anim
        this.anims.create({
            key: 'p1-move',
            frames: this.anims.generateFrameNumbers('p1-move', { start: 0, end: 6 }),
            frameRate: 10,
        });

        //Jump anim
        this.anims.create({
            key: 'p1-jump',
            frames: this.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
            frameRate: 6,
        });

        //Block anim
        this.anims.create({
            key: 'p1-block',
            frames: this.anims.generateFrameNumbers('p1-block', { start: 0, end: 0 }),
            frameRate: 1,
        });

        //Death anim
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('death', { start: 0, end: 6 }),
            frameRate: 10,
            repeat:0
        });
    }
}

//update
class PlayerUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        //Send weapon rect underground
        rectW.y=game.config.height-5;

        stateMachine.step();
    }
}

//idle
class IdleState extends State{
  
    enter(scene){
        player.setVelocity(0);
        player.anims.play('p1-idle', true); 

        //End turn here
        turnAction ='end';            
    }

    execute(scene){
        //to death
        if(playerAp <= 0) {
            stateMachine.transition('death');
            return;
        }

        //to move
        if (turnAction == 'moveLeft' || turnAction == 'moveRight'){
            this.stateMachine.transition('move');
            return;
        }

        //to jump
        if (turnAction == ''){
            this.stateMachine.transition('jump');
            return;
        }

        //to attack
        if (turnAction == 'attack'){
            this.stateMachine.transition('attack');
            return;
        }

        //to block
        if (turnAction == 'block'){
            this.stateMachine.transition('block');
            return;
        }
    }
}

//move
class MoveState extends State {
    enter(scene) {

        if (turnAction == 'moveLeft'){
            player.anims.play('p1-move', true).setFlipX(true);
            turnAction ='end'; 

            //twin
            scene.tweens.add({
                targets: player,
                x: player.x - cell,
                y: player.y,
                ease: 'Power1',
                duration: 500,
            });
            
              
        }  else if (turnAction == 'moveRight'){
            player.anims.play('p1-move', true).setFlipX(false);
            
            //twin
            scene.tweens.add({
                targets: player,
                x: player.x + cell,
                y: player.y,
                ease: 'Power1',
                duration: 500,
            });
        }

        //end turn
            scene.time.delayedCall(500, () => {  
                this.stateMachine.transition('idle');
                return;
            }); 
    }
}

//jump
class JumpState extends State {
    enter(scene) {
    
        if (keys.up.isDown && player.body.touching.down){
            player.setVelocityY(-jumpVel);
            player.anims.play('p1-jump', true); 
            player.direction = 'up'; 

            scene.time.delayedCall(jumpTime, () => {  
                player.setVelocityY(-floatVelY);
            });   
        }  
    }

    execute(scene){

        if (keys.up.isUp){
            this.stateMachine.transition('idle'); 
        } 

    }
}

//attack
class AttackState extends State{
    enter(scene) {

        //If jumping reduce vel after timer
        scene.time.delayedCall(attStartupTime, () => {
            player.setVelocity(0);
        });

        player.anims.play('p1-attack', true);

        scene.physics.add.existing(rectW);
        rectW.body.setAllowGravity(false);
        
        rectW.body.width = weaponRange;
        rectW.body.height = 16;

        
        scene.time.delayedCall(attStartupTime, () => {
            if (player.flipX == false){
                rectW.x = player.x + player.body.width/2;  
            } 
            else {
                rectW.x = player.x - player.body.width*2;
            }
            rectW.y = player.y - rectW.body.height/2;  
        });

        //end turn
        scene.time.delayedCall(500, () => { 
            this.stateMachine.transition('idle');  
            return;    
        });
    }
}

//block
class BlockState extends State{
    enter(scene) {

        player.anims.play('p1-block', true);

        scene.physics.add.existing(rectW2);
        rectW2.body.setAllowGravity(false);
        rectW2.body.immovable = true;
        
        rectW2.body.width = 8;
        rectW2.body.height = 36;
        
         
        scene.time.delayedCall(blockStartupTime, () => {
            //Right
            if (player.flipX == false){
                rectW2.x = player.x + player.body.width/2;
                    
            } 
            //Left
            else {
                rectW2.x = player.x - player.body.width/2 - rectW2.body.width;
            }
            rectW2.y = player.y - rectW2.body.height/2; 
        });

        scene.time.delayedCall(blockTime, () => {
                
            rectW2.y=game.config.height-5;
            
            this.stateMachine.transition('idle');
            return;      
        });
               
    }
}

//death
class DeathState extends State{
    enter(scene) {

        player.anims.play('death', false);

        scene.time.delayedCall(2000, () => {
            game.scene.start('SceneTitle');
        } );    
    }
}