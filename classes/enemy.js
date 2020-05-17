//preload
class EnemyPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
        this.load.spritesheet('e-idle', 'assets/e-idle.png', {frameWidth: 96, frameHeight: 96,});
        this.load.spritesheet('e-attack', 'assets/e-attack.png', {frameWidth: 96, frameHeight: 96,});
        this.load.image('chest', 'assets/it/chest.png');

        this.load.spritesheet('mummy-idle', 'assets/desert-enemy/5 Mummy/Mummy_idle.png',{frameWidth: 48, frameHeight: 48,});
        this.load.spritesheet('mummy-walk', 'assets/desert-enemy/5 Mummy/Mummy_walk.png',{frameWidth: 48, frameHeight: 48,});
        this.load.spritesheet('mummy-attack', 'assets/desert-enemy/5 Mummy/Mummy_attack.png',{frameWidth: 48, frameHeight: 48,});
        this.load.spritesheet('mummy-death', 'assets/desert-enemy/5 Mummy/Mummy_death.png',{frameWidth: 48, frameHeight: 48,});
    }
}

//create
class EnemyCreate extends Phaser.GameObjects.Container
{
    constructor(config, x)
    {
        super(config.scene);

        this.anims = config.scene.anims;
  
        enemy = config.scene.physics.add.sprite(0,0, 'e-idle');
        enemy.x = x;
        enemy.body.setSize(56, 68, 1, 1); 
        enemyAp = 2;
        
//walk
        this.anims.create({
            key: 'p2-walk',
            frames: this.anims.generateFrameNumbers('p2-walk', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

//idle
        this.anims.create({
            key: 'e-idle',
            frames: this.anims.generateFrameNumbers('e-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

        enemy.anims.play('e-idle', false);

//attack
        this.anims.create({
            key: 'e-attack',
            frames: this.anims.generateFrameNumbers('e-attack', { start: 0, end: 0 }),
            frameRate: 1,
        });       

//death
        this.anims.create({
            key: 'e-death',
            frames: this.anims.generateFrameNumbers('e-attack', { start: 0, end: 0 }),
            frameRate: 1,
            repeat:1,
        });   
    }
};

//create mummy
class MummyCreate extends Phaser.GameObjects.Container{
    constructor(config, x, id)
    {
        super(config.scene);        
        this.anims = config.scene.anims;

//walk
        this.anims.create({
            key: 'mummy-walk',
            frames: this.anims.generateFrameNumbers('mummy-walk', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

//idle
        this.anims.create({
            key: 'mummy-idle',
            frames: this.anims.generateFrameNumbers('mummy-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1 // -1 run forever / 1 -> run once
        });

        mummy.anims.play('mummy-idle', false);

//attack
        this.anims.create({
            key: 'mummy-attack',
            frames: this.anims.generateFrameNumbers('mummy-attack', { start: 0, end: 0 }),
            frameRate: 1,
        });       

//death
        this.anims.create({
            key: 'mummy-death',
            frames: this.anims.generateFrameNumbers('mummy-attack', { start: 0, end: 0 }),
            frameRate: 1,
            repeat:1,
        });   
    }
}

//update
class EnemyUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        enemyStateMachine.step();

        if(turnAction == 'end'){
            if (player.x - mummy.x <= -cell){
                mummy.anims.play('mummy-walk', true).setFlipX(false); 

                config.scene.tweens.add({
                    targets: mummy,
                    x: mummy.x - cell,
                    ease: 'Power1',
                    duration: 500,
                });

                config.scene.time.delayedCall(500, () => {  
                    mummy.anims.play('mummy-idle', true);
                   
                }); 

            }

            else if (player.x - mummy.x >= cell){
                
                mummy.anims.play('mummy-walk', true).setFlipX(true);

                config.scene.tweens.add({
                    targets: mummy,
                    x: mummy.x + cell,
                    ease: 'Power1',
                    duration: 500,
                });

                config.scene.time.delayedCall(500, () => {  
                    mummy.anims.play('mummy-idle', true);
        
                }); 
            }  
            else if (player.x - mummy.x > -cell){
                mummy.anims.play('mummy-attack', true).setFlipX(false); 

                config.scene.time.delayedCall(500, () => {  
                    mummy.anims.play('mummy-idle', true);
                    
                }); 

            }

            else if (player.x - mummy.x < cell){
                
                mummy.anims.play('mummy-attack', true).setFlipX(true);

                config.scene.time.delayedCall(500, () => {  
                    mummy.anims.play('mummy-idle', true);
                    
                }); 
            }  
        } 

    }
}

//idle
class EnemyIdleState extends EnemyState{
  
    enter(scene){
        enemy.setVelocity(0);
        enemy.anims.play('e-idle', false);      
    }

    execute(scene){

        //to death
        if(enemyAp <= 0) {
            enemyStateMachine.transition('enemyDeath');
            return;
        }

        if (turnAction != 'end'){
            //to move
            if (Math.abs(player.x - enemy.x) > cell ){
                enemyStateMachine.transition('enemyMove');
                return;
            } 
            //to attack
            else if(Math.abs(player.x - enemy.x) < cell -24 ) {
                enemyStateMachine.transition('enemyAttack');
                return;
            }   
        }

        
    }
}

//move
class EnemyMoveState extends EnemyState{
  
    enter(scene){
        //follow left
        if (player.x - enemy.x <= - cell){

            enemy.anims.play('e-idle', true).setFlipX(false); 

            scene.tweens.add({
                targets: enemy,
                x: enemy.x - cell,
                ease: 'Power1',
                duration: 500,
            });
        } 

        //follow right
        else if (player.x - enemy.x >= cell){
            
            enemy.anims.play('e-idle', true).setFlipX(true);

            scene.tweens.add({
                targets: enemy,
                x: enemy.x + cell,
                ease: 'Power1',
                duration: 500,
            });
        }     
                        
        //end turn
            scene.time.delayedCall(500, () => {  
                this.enemyStateMachine.transition('enemyIdle');
                return;
            }); 
    }
}

//attack
class EnemyAttackState extends EnemyState{
  
    enter(scene){
        
        enemy.setVelocity(0);
        enemy.anims.play('e-attack', false);
        // if(player.x - Math.abs(player.x - enemy.x) <= cell){
            playerAp--
            generateActions();
        // }



        scene.time.delayedCall(enemyAttackSpeed, () => {

            enemyStateMachine.transition('enemyIdle');
            return;
            
        });                              
    }  
}

//Death
class EnemyDeathState extends EnemyState{
    enter(scene){
        enemy.anims.play('e-death', false);

        scene.time.delayedCall(500, () => {
            getAction();
            enemy.destroy();
        });       
    }    
}