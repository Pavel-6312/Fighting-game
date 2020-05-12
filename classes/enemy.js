//preload
class EnemyPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
        this.load.spritesheet('e-idle', 'assets/e-idle.png', {frameWidth: 96, frameHeight: 96,})
        this.load.spritesheet('e-attack', 'assets/e-attack.png', {frameWidth: 96, frameHeight: 96,})
        this.load.image('fireball', 'assets/fire-ball.png')
    }
}

//create
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
        this.game = config.scene.game;
        this.fireballGroup = config.scene.fireballGroup;

        enemy = this.physics.add.sprite(game.config.width*0.62+1,game.config.height/2, 'e-idle');

        enemy.setCollideWorldBounds(true);
        enemy.body.setSize(56, 68, 1, 1); 
        enemyHp =10;
        enemyDamageReceived = 0;

//Fireballs
        fireball = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'fireball');
        fireball.body.setAllowGravity(false);
        fireball.body.setBounce(0.1, 0.1);

        fireball.setCollideWorldBounds(true);
        fireball.body.setVelocityX(Phaser.Math.Between(-100,100));
        fireball.setVelocityY(20);
     
        //Collider
        this.physics.add.collider(enemy, platforms);
        this.physics.add.collider(fireball, platforms);
        

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
    }
};

//update
class EnemyUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        enemyStateMachine.step();
    }
}

//idle
class EnemyIdleState extends EnemyState{
  
    enter(scene){
        enemy.setVelocity(0);
        enemy.anims.play('e-idle', false);      
    }

    execute(scene){

        // to move
        if (Math.abs(distance) > fightDistance ){
            enemyStateMachine.transition('enemyMove');
            return;
        }

        //to attack
        else {
            enemyStateMachine.transition('enemyAttack');
            return;
        }
    }
}

//move
class EnemyMoveState extends EnemyState{
  
    enter(scene){
        

        if (distance < -fightDistance){
            enemy.setVelocityX(-enMoveVel);
            enemy.anims.play('e-idle', true).setFlipX(false); 
        } 

        //Follow right
        else if (distance > fightDistance){
            enemy.setVelocityX(enMoveVel);
            enemy.anims.play('e-idle', true).setFlipX(true);
        }      
    }

    execute(scene){

        // to move
        if (Math.abs(distance) <= fightDistance ){
            enemyStateMachine.transition('enemyAttack');
            return;
        }
    }
}

//attack
class EnemyAttackState extends EnemyState{
  
    enter(scene){
        
        enemy.setVelocity(0);
        enemy.anims.play('e-attack', false);
        fireball.x = enemy.x;
        fireball.y = enemy.y - 80;

        scene.time.delayedCall(attStartupTime, () => {
            if (distance < 0){
                fireball.body.setVelocityX(-enemyProjectileVel);
                fireball.y = player.y;  
            } 

            else {
                fireball.body.setVelocityX(enemyProjectileVel);
                fireball.y = player.y;
            } 
            enemy.anims.play('e-idle', false);
        }); 

        scene.time.delayedCall(enemyAttackSpeed, () => {
            
            fightDistance = Phaser.Math.Between(minFightDistance, maxFightDistance);
            enemyAttackSpeed = 1500 + Phaser.Math.Between(-500, 1000);

            if (Math.abs(distance) > fightDistance ){
                enemyStateMachine.transition('enemyMove');
                return;
            } 

            else if(enemyDamageReceived > 1){
                enemyStateMachine.transition('enemyAvoid');
                return;
            }
            
            else {
                enemyStateMachine.transition('enemyIdle');
                return;
            }
        });                              
    }  
}

//avoid
class EnemyAvoidState extends EnemyState{
  
    enter(scene){

        enemy.anims.play('e-attack', false);

        scene.time.delayedCall(500, () => {
            //to stealth
            if (enemyHp <= 5 ){
                enemyStateMachine.transition('enemyStealth');
                return;
            } 

            // to Idle
            else {
                enemyStateMachine.transition('enemyIdle');
                return;
            }
        });

    //Fireball aoe, move to a state
        fireballs = scene.physics.add.group({
            key: 'fireball',
            repeat: Phaser.Math.Between(3, 5),
            setXY: { x: player.x-60, y: Phaser.Math.Between(120, 220), stepX: Phaser.Math.Between(20, 40), stepY: Phaser.Math.Between(-40, 10)}
        });

        //Add props to sprites
        fireballs.children.iterate(function (child) {
            child.body.setAllowGravity(false);
        });

        scene.time.delayedCall(350, () => {
            fireballs.children.iterate(function (child) {
                child.body.setAllowGravity(true);
            });
        });
    //Collider
        scene.physics.add.overlap(player, fireballs, enemyHit.bind(this));     
    }

    execute(scene){
        if (distance < 0){
            enemy.setVelocityX(enMoveVel+200);
            enemy.anims.play('e-idle', true).setFlipX(true); 
        } 

        //Follow right
        else if (distance > 0){
            enemy.setVelocityX(-enMoveVel-200);
            enemy.anims.play('e-idle', true).setFlipX(false);
        }   
    }

}

//stealth
class EnemyStealthState extends EnemyState{
  
    enter(scene){
        currentDamageReceived = enemyDamageReceived;
        enemy.setAlpha(0.5);

        scene.time.delayedCall(500, () => {
            enemy.setAlpha(0);
            enemy.x = Phaser.Math.Between(0, 300);
        });

        scene.time.delayedCall(2500, () => {
            enemy.setAlpha(1);
            enemyStateMachine.transition('enemyAttack');
            return;
        });
    }

    execute(scene){
        //Uncover to idle
        if (currentDamageReceived - enemyDamageReceived < 0){
            enemy.setAlpha(1);
            enemyStateMachine.transition('enemyIdle');
            return;
        }  
    }

}