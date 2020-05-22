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
        this.load.spritesheet('p1-bow', 'assets/p-bow.png', {frameWidth: 48, frameHeight: 48,})

        this.load.spritesheet('p1-death', 'assets/desert-enemy/5 Mummy/Mummy_death.png', {frameWidth: 48, frameHeight: 48,})
    }
}

//create
class PlayerCreate extends Phaser.GameObjects.Container
{
    constructor(config, x)
    {
        super(config.scene);

        player = config.scene.physics.add.sprite(x, 0 , 'p1-idle');
        playerAp= 10;

        //Idle anim
        config.scene.anims.create({
            key: 'p1-idle',
            frames: config.scene.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });

        //Attack anim
        config.scene.anims.create({
            key: 'p1-attack',
            frames: config.scene.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
            frameRate: 10,
            repeat:0
        });

        //Walk anim
        config.scene.anims.create({
            key: 'p1-move',
            frames: config.scene.anims.generateFrameNumbers('p1-move', { start: 0, end: 6 }),
            frameRate: 10,
        });

        //Jump anim
        config.scene.anims.create({
            key: 'p1-jump',
            frames: config.scene.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
            frameRate: 6,
        });

        //Block anim
        config.scene.anims.create({
            key: 'p1-block',
            frames: config.scene.anims.generateFrameNumbers('p1-block', { start: 0, end: 0 }),
            frameRate: 10,
        });

        //Death anim
        config.scene.anims.create({
            key: 'p1-death',
            frames: config.scene.anims.generateFrameNumbers('p1-death', { start: 0, end: 6 }),
            frameRate: 10,
            repeat:0
        });

        //Bow anim
        config.scene.anims.create({
            key: 'p1-bow',
            frames: config.scene.anims.generateFrameNumbers('p1-bow', { start: 0, end: 6 }),
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
        stateMachine.step();
    }
}

//idle
class IdleState extends State{
  
    enter(scene){
        player.setVelocity(0);
        player.anims.play('p1-idle', true);  
        generateActions();  
        // turnAction.action = playerActionsArray[turnAction.id].var     
    }

    execute(scene){
        //to death
        if(playerAp <= 0) {
            stateMachine.transition('death');
            return;
        }

        //to move
        if (turnAction.action == 'moveLeft' || turnAction.action == 'moveRight'){
            this.stateMachine.transition('move');
            return;
        }

        //to attack
        if (turnAction.action == 'attack'){
            this.stateMachine.transition('attack');
            return;
        }

        //to block
        if (turnAction.action == 'block'){
            this.stateMachine.transition('block');
            return;
        }

        //to block
        if (turnAction.action == 'bow'){
            this.stateMachine.transition('bow');
            return;
        }
    }
}

//move
class MoveState extends State {
    enter(scene) {

        if (turnAction.action == 'moveLeft'){
            player.anims.play('p1-move', true).setFlipX(true);
            turnAction.action ='end'; 

            //twin
            scene.tweens.add({
                targets: player,
                x: player.x - cell,
                ease: 'Power1',
                duration: 500,
            });
            
              
        }  else if (turnAction.action == 'moveRight'){
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
        playerActionsArray[turnAction.id].durability--
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

        player.anims.play('p1-death', false);

        scene.time.delayedCall(2000, () => {
            game.scene.start('SceneTitle');
        } );    
    }
}

//block
class BlockState extends State{
    enter(scene) {
        if(playerActionsArray[turnAction.id].durability>=0){
            playerActionsArray[turnAction.id].durability--
            player.anims.play('p1-block', true);
            turnAction.action ='block';   
        
            //end turn
            scene.time.delayedCall(500, () => { 
                this.stateMachine.transition('endturn');  
                return;    
            });
        }
    }
}

//bow
class BowState extends State{
    enter(scene) {
        if(playerActionsArray[turnAction.id].durability >= 0 && enemyArray[0] !== undefined){
            playerActionsArray[turnAction.id].durability--
            player.anims.play('p1-bow', true);

            var closestArr =[];

            //Push distances to arr
            for(var i = 0; i < enemyArray.length; i++){
                enemyArray[i].distance = distance(player, window[enemyArray[i].id]);
                closestArr.push(distance(player, window[enemyArray[i].id]));
            } 

            //Get index of obj with smallest distance
            const target = enemyArray.findIndex(x => x.distance === Math.min(...closestArr));

            // Deal damage
            enemyArray[target].ap--;
            
            //end turn
            scene.time.delayedCall(500, () => { 
                this.stateMachine.transition('endturn');  
                return;    
            });
        }
    }
}

//end turn
class EndTurnState extends State{
    enter(scene) {

        //run enemy logic
        for(i=0; i < enemyArray.length; i++){
            baseAi(scene, window[enemyArray[i].id], enemyArray[i].animKey, i);
        }
        turnAction.id =null; 
        turnAction.action =null;   
        this.stateMachine.transition('idle');
    }
}