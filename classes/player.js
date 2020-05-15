//preload
class PlayerPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
         //Player
        
        this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
        
        this.load.spritesheet('p1-walk', 'assets/p-run.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-jump', 'assets/p-jump.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-idle', 'assets/p-idle.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-attack', 'assets/p-attack.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-block', 'assets/p-block.png', {frameWidth: 48, frameHeight: 48,})
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
        player = this.physics.add.sprite(game.config.width*0.25, game.config.height/2, 'p1-idle');

        //Properties
        player.direction = 'right';
        player.setCollideWorldBounds(true);
        player.body.setSize(16, 36, 1, 1);// X, Y, XYOffset
        playerHp=15;
        
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

        //Death anim
        this.anims.create({
            key: 'p1-death',
            frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 2 }),
            frameRate: 6,
            repeat: 0
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
            key: 'p1-walk',
            frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
            frameRate: 10,
        });

        //Jump anim
        this.anims.create({
            key: 'p1-jump',
            frames: this.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
            frameRate: 6,
        });   

        //Dash charge anim
        this.anims.create({
            key: 'p1-dash-charge',
            frames: this.anims.generateFrameNumbers('p1-attack', { start: 1, end: 1 }),
            frameRate: 1,
        });  

        //Dash anim
        this.anims.create(
        {
            key: 'p1-dash',
            frames: this.anims.generateFrameNumbers('p1-walk', { start: 4, end: 4 }),
            frameRate: 1,
        });  

        //Block anim
        this.anims.create({
            key: 'p1-block',
            frames: this.anims.generateFrameNumbers('p1-block', { start: 0, end: 0 }),
            frameRate: 1,
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
    }

    execute(scene){
        const{left, right, up, down, space, shift} = keys;
        // if(player.setVelocityX != 0){
            
        //     player.setVelocityX();
        // }

        //to dash
        if (space.isDown || space.isDown && left.isDown || space.isDown && right.down){
            this.stateMachine.transition('dash');
            return;
        }

        //to move
        if (left.isDown || right.isDown ){
            this.stateMachine.transition('move');
            return;
        }

        //to jump
        if (keys.up.isDown && player.body.touching.down || player.body.touching.down == 'false' ){
            this.stateMachine.transition('jump');
            return;
        }

        //to attack
        if ( key1.isDown){
            this.stateMachine.transition('attack');
            return;
        }

        //to block
        if ( key2.isDown ){
            this.stateMachine.transition('block');
            return;
        }
    }
}

//move
class MoveState extends State {
  execute(scene) {
    const {left, right, up, down, space, shift} = keys;
    
    // to dash
    if (space.isDown || space.isDown && left.isDown || space.isDown && right.down) {
        // if(player.direction =='left' && player.body.velocity.x < 0){
        //     player.body.setVelocityX(-moveVel + 200);
        // }
        // else if (player.body.velocity.x > 0) {
        //     player.body.setVelocityX(moveVel - 200);
        // }  
      this.stateMachine.transition('dash');
      return;
    }
    
    // to idle
    if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
      this.stateMachine.transition('idle');
      return;
    }

    // to jump
    if (keys.up.isDown && player.body.touching.down){
        this.stateMachine.transition('jump');
        return;
    }

    // to attack
    if ( key1.isDown){
        player.setVelocity(0);
        this.stateMachine.transition('attack');
        return;
    }

    //to block
    if ( key2.isDown){
        this.stateMachine.transition('block');
        return;
    }
    
    //Floating r/l
    if (left.isDown && player.body.touching.down) {
        player.setVelocityX(-moveVel);
        player.direction = 'left';
        player.anims.play('p1-walk', true).setFlipX(true);
    } 

    else if (right.isDown && player.body.touching.down) {
        player.setVelocityX(moveVel);
        player.direction = 'right';
        player.anims.play('p1-walk', true).setFlipX(false);
    } 
  }
}

//dash
class DashState extends State {
    enter(scene) {
        player.anims.play('p1-dash-charge', true);    
    }

    execute(scene) {
        dashTime+=10;
          
        
        if(keys.space.isUp){
            if(dashTime>300){
                dashTime=300;
            }

            if(player.direction == 'left'){
                player.anims.play('p1-dash', true); 
                player.setVelocityX(-dashVel);
            } 

            else if(player.direction == 'right'){
                player.anims.play('p1-dash', true); 
                player.setVelocityX(dashVel);
            }

            else if(player.direction == 'up'){
                player.anims.play('p1-dash', true); 
                player.setVelocityY(-dashVel);
            }

            // //Delay transition to idle
            scene.time.delayedCall(dashTime, () => { 
                if(player.body.touching.down){
                    this.stateMachine.transition('idle');
                } else{
                    this.stateMachine.transition('jump');
                }
                
                dashTime=20;
                
            });          
        }      
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
        const{left, right, up, down, space, shift} = keys;
        // float r
        if (player.body.touching.down==false && keys.right.isDown){
            player.setVelocityX(floatVelX);
            player.anims.play('p1-jump', true).setFlipX(false);
            player.direction = 'right';
        }

        // float l
        else if (player.body.touching.down==false && keys.left.isDown){
            player.setVelocityX(-floatVelX);
            player.anims.play('p1-jump', true).setFlipX(true);
            player.direction = 'left';
        }

        else if (player.body.touching.down==false){
            player.direction = 'up'
        } 
        
        else {
            player.setVelocity(0);
            player.anims.play('p1-idle', true);
        }

        //fall down
        if (keys.down.isDown){        
            player.setVelocityY(floatVelY);
            player.anims.play('p1-jump', true);
            // player.direction = 'down'
        }

        // to idle
        if (player.body.touching.down && keys.up.isUp){
            this.stateMachine.transition('idle'); 
        } 

        else if (
            player.body.touching.down && left.isDown && keys.up.isUp
            || 
            player.body.touching.down && right.isDown && keys.up.isUp
        )
        {
            this.stateMachine.transition('move');
            return;
        }

        // to dash
        if (space.isDown || space.isDown && left.isDown || space.isDown && right.down){
            this.stateMachine.transition('dash');
            return;
        }

        // to attack
        if ( key1.isDown ){
            this.stateMachine.transition('attack');
            return;
        } 

        // to block
        if ( key2.isDown ){
            this.stateMachine.transition('block');
            return;
        }

        if (player.body.touching.down){
            playerTouchedDown = true;
        }

        // to climb
        if (
                keys.left.isDown && 
                player.body.touching.left && 
                player.body.touching.down ==false &&
                playerTouchedDown == true
                || 
                player.body.touching.right && 
                keys.right.isDown && 
                player.body.touching.down ==false &&
                playerTouchedDown == true
            ){ 
                this.stateMachine.transition('climb');
            return;
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

        if (key1.isDown){ 
            scene.time.delayedCall(attStartupTime, () => {
                    if (player.flipX == false){
                        rectW.x = player.x + player.body.width/2;  
                    } 
                    else {
                        rectW.x = player.x - player.body.width*2;
                    }
                    rectW.y = player.y - rectW.body.height/2;  
            });
        }

        const{left, right, up, down, space, shift} = keys;

        scene.time.delayedCall(attTime, () => { 
            if (left.isDown || right.isDown ){
                // to move
                this.stateMachine.transition('move');
                return;
            } 
            else if (keys.up.isDown && player.body.touching.down){
                //to jump
                this.stateMachine.transition('jump');
                return;
            }
            else if(key2.isDown){
                //to block
                this.stateMachine.transition('block');
                return;
            }
            else{
                // to idle
                this.stateMachine.transition('idle');  
                return;
            }
        });
    }
}

//block
class BlockState extends State{
    enter(scene) {

        //If jumping reduce vel after timer
        // scene.time.delayedCall(attStartupTime, () => {
        //     player.setVelocity(0);
        // });

        player.anims.play('p1-block', true);

        scene.physics.add.existing(rectW2);
        rectW2.body.setAllowGravity(false);
        rectW2.body.immovable = true;
        
        rectW2.body.width = 8;
        rectW2.body.height = 36;
        
        if (key2.isDown){ 
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
        }        
    }

    execute(scene) {
        const{left, right, up, down, space, shift} = keys;

        // to move
        if (left.isDown || right.isDown ){
            rectW2.y=game.config.height-5;
            this.stateMachine.transition('move');
            return;
        } 

        //to jump
        else if (keys.up.isDown && player.body.touching.down){
            rectW2.y=game.config.height-5;
            this.stateMachine.transition('jump');
            return;
        }

        // to idle
        else{
            scene.time.delayedCall(blockTime, () => {
                if(key2.isUp){ 
                    rectW2.y=game.config.height-5;
                }
                this.stateMachine.transition('idle');
                return;      
            });
        }
    }
}

//climb
class ClimbState extends State{
    enter(scene) {
        player.setVelocityY(0); 
        player.body.setAllowGravity(false);

        //only wall jump after touching ground
        playerTouchedDown = false;
    }

    execute(scene) {  

        // hold left
        if (keys.left.isDown && player.body.touching.left && keys.up.isUp || keys.left.isDown && player.body.touching.left && keys.up.isDown){ 
            player.setVelocityY(0); 
            player.setVelocityX(-1); 

            //to walljump
            this.stateMachine.transition('walljump');
            return;
        } 

        // hold right
        else if (keys.right.isDown && player.body.touching.right && keys.up.isUp || player.body.touching.right && keys.right.isDown && keys.up.isDown){
            player.setVelocityY(0); 
            player.setVelocityX(1); 

            // to walljump
            this.stateMachine.transition('walljump');
            return;
        } 

        //to jump
        else {
            player.body.setAllowGravity(true);
            this.stateMachine.transition('jump');
            return;
        }
    }
}

//wall jump
class WallJump extends State{
    enter(scene) {
    }

    execute(scene) {
        const{left, right, up, down, space, shift} = keys;
        
        if (keys.up.isDown){ 
              
            player.body.setAllowGravity(true);

            if(player.direction == 'left'){
                player.setVelocityY(-floatVelY*0.75);
                player.setVelocityX(floatVelX*0.75);
            } 
            else if (player.direction == 'right'){
                player.setVelocityY(-floatVelY*0.75);
                player.setVelocityX(-floatVelX*0.75);
            }
            
            this.stateMachine.transition('jump');
            return; 
        } 
        else if (keys.down.isDown){
            player.body.setAllowGravity(true);

            this.stateMachine.transition('idle');
            return; 
        }
    }
}