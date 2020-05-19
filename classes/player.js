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
    constructor(config, x)
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
        player = this.physics.add.sprite(x, 0 , 'p1-idle');

        //Properties
        // player.body.setSize(16, 36, 1, 1);// X, Y, XYOffset

        playerAp= 5;
        
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
        generateActions();       
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
                ease: 'Power1',
                duration: 500,
            });
            
              
        }  else if (turnAction == 'moveRight'){
            player.anims.play('p1-move', true).setFlipX(false);
            
            //twin
            scene.tweens.add({
                targets: player,
                x: player.x + cell,
                ease: 'Power1',
                duration: 500,
            });
        }

        //end turn
        scene.time.delayedCall(500, () => {  
            this.stateMachine.transition('endturn');
            return;
        }); 
    }
}

//attack
class AttackState extends State{
    enter(scene) {

        player.anims.play('p1-attack', true);

        for(var i = 0; i < enemyArray.length; i++){
            var distanceEnemy = distance(player, window[enemyArray[i].id]);

            if(distanceEnemy < 1 && distanceEnemy > -1){
                enemyArray[i].ap--;
            }
        }

        //end turn
        scene.time.delayedCall(500, () => { 
            this.stateMachine.transition('endturn');  
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

//end turn
class EndTurnState extends State{
    enter(scene) {

        //run enemy logic
        for(i=0; i < enemyArray.length; i++){
            baseAi(scene, window[enemyArray[i].id], enemyArray[i].animKey, i);
        }

        turnAction ='end';   
        // enemyTurn = true; 
        this.stateMachine.transition('idle');
    }
}

//block
class BlockState extends State{
    enter(scene) {
        player.anims.play('p1-block', true);
        turnAction ='block';   
        
        //end turn
            scene.time.delayedCall(500, () => { 
                this.stateMachine.transition('endturn');  
                return;    
            });
    }
}