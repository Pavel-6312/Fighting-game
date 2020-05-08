//Preload
class PlayerPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
         //Player
        this.load.spritesheet('p1-idle', 'assets/character/2 GraveRobber/GraveRobber_idle.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p1-attack', 'assets/character/2 GraveRobber/GraveRobber_attack1.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-walk', 'assets/character/2 GraveRobber/GraveRobber_run.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-jump', 'assets/character/2 GraveRobber/GraveRobber_jump.png', {frameWidth: 48, frameHeight: 48,})
    }
}

//Create
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
        player.direction = 'down';
        player.setCollideWorldBounds(true);
        player.body.setSize(16, 48, 8, 24);// X, Y, XYOffset
        playerHp=30;    

        //Weapon
        playerW = this.physics.add.sprite(player.x, player.y, 'weapon');
        playerW.body.setAllowGravity(false);
        playerW.setAlpha(0);
        
        //Collider
        this.physics.add.collider(player, platforms);


        //ANIMATIONS

        //Idle
        this.anims.create({
                key: 'p1-idle',
                frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
                frameRate: 6,
                repeat: -1
            });

        //Death
        this.anims.create(
            {
                key: 'p1-death',
                frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 6 }),
                frameRate: 3,
                repeat: 1
            });

        //Attack
        this.anims.create(
            {
                key: 'p1-attack',
                frames: this.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
                frameRate: 10,
            });

        //Walk
        this.anims.create(
            {
                key: 'p1-walk',
                frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
                frameRate: 10,
            });

        //Run
        this.anims.create(
            {
                key: 'p1-jump',
                frames: this.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
                frameRate: 6,
            });       
    }
}

//Update
class PlayerUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.player = config.scene.player;
            

            //Attack
            playerW.x=player.x;
            playerW.y=player.y; 
            playerW.body.setSize(1, 1, 1, 1  );
        
            if (keyAction1.isDown) 
            {
                player.anims.play('p1-attack', true);
                var weaponRange = 24; 
                 
                if (player.flipX == true)
                {
                    weaponRange = weaponRange * -1
                    playerW.x = player.x + weaponRange; 
                }

                else 
                {
                    playerW.x = player.x + weaponRange;  
                }

                 playerW.body.setSize(24, 8, 8, 12);
                 playerW.setAlpha(1);
                        
            }

            if (keyAction1.getDuration()>1000/15)
            {
                playerW.body.setSize(1, 1, 1, 1  ) ;
                playerW.x=player.x;
                playerW.setAlpha(0);
            }

        if (Date.now() > lastHitTimeEnemy + 200 == true && playerHp > 5) 
        {
            player.clearTint()
        }
    }
}

//STATES
//Idle state
class IdleState extends State{
  
    enter(scene){
        player.setVelocity(0);
        player.anims.play('p1-idle', true);        
    }

    execute(scene){
        const{left, right, up, down, space, shift} = keys;

        // Transition to dash
        if (space.isDown || space.isDown && left.isDown || space.isDown && right.down){
            this.stateMachine.transition('dash');
            return;
        }
        // Transition to move
        if (left.isDown || right.isDown ){
            this.stateMachine.transition('move');
            return;
        }

        // Transition to jump
        if (keys.up.isDown && player.body.touching.down){
            this.stateMachine.transition('jump');
            return;
        }
    }
}

//Move state
class MoveState extends State {
  execute(scene) {
    const {left, right, up, down, space, shift} = keys;
    
    // Transition to dash
    if (space.isDown || space.isDown && left.isDown || space.isDown && right.down) {
      this.stateMachine.transition('dash');
      return;
    }
    
    // Transition to idle if not pressing movement keys
    if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
      this.stateMachine.transition('idle');
      return;
    }

    // Transition to jump
    if (keys.up.isDown && player.body.touching.down){
        this.stateMachine.transition('jump');
        return;
    }
    
    if (left.isDown && player.body.touching.down) {
        player.setVelocityX(-240);
        player.direction = 'left';
        player.anims.play('p1-walk', true).setFlipX(true);
    } 

    else if (right.isDown && player.body.touching.down) {
        player.setVelocityX(240);
        player.direction = 'right';
        player.anims.play('p1-walk', true).setFlipX(false);
    }
  }
}

//Dash state
class DashState extends State {
  enter(scene) {

    if(player.direction == 'left'){
        player.setVelocityX(-600);
    }

    else{
        player.setVelocityX(600);
    }
    
    // Wait a third of a second and then go back to idle
    scene.time.delayedCall(100, () => {
      this.stateMachine.transition('idle');
    });
  }
}

class JumpState extends State {
    enter(scene) {
    
        if (keys.up.isDown && player.body.touching.down){
            player.setVelocityY(-550);
            player.anims.play('p1-jump', true);  
        }  
    }

    execute(scene){
        if(player.body.touching.down){
            this.stateMachine.transition('idle');
        } 

        else if (keys.right.isDown) 
            {
                player.setVelocityX(200);
                player.anims.play('p1-jump', true).setFlipX(false);
                player.direction = 'right';
            }

        else if (keys.left.isDown) 
        {
            player.setVelocityX(-200);
            player.anims.play('p1-jump', true).setFlipX(true);
            player.direction = 'left';
        }

        else if (keys.down.isDown) 
        {
            player.setVelocityY(500);
            player.anims.play('p1-jump', true);
        }
    }
}














// //Delay transition to idle
// scene.time.delayedCall(500, () => {     
//     this.stateMachine.transition('idle');
// });

//Generate random number
// setInterval(function(){
//     rNum = Phaser.Math.Between(0,300);
// }, 1000);


//Player alt
// class Player extends Phaser.Physics.Arcade.Sprite {
//   constructor (config) {
//     super(config.scene, config.x, config.y, config.texture, config.frame);

//     this.scene.add.existing(this);
//     this.scene.physics.add.existing(this);

//     // Set physics stuff on body …

//     //The state machine managing the player
//         this.stateMachine = new StateMachine('idle', {
//             idle: new IdleState(),
//             move: new MoveState(),
//             dash: new DashState(),
//         },[this, this.player]);
//   }

//     update () { 
//     //State machine
//         this.stateMachine.step();
//     }
// }
