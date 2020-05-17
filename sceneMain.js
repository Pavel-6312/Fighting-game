class SceneMain extends Phaser.Scene {
    constructor() 
    {
        super('SceneMain');
    }

    preload() { 
        new PlatformsPreload({scene:this}); 
        new PlayerPreload({scene:this}); 
        new EnemyPreload({scene:this}); 
    }

    create() {   
   

    //Player state machine
        stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            attack: new AttackState(),
            block: new BlockState(),
            death: new DeathState(),
        },[this, this.player]);  

    //Enemy state machine
        enemyStateMachine = new EnemyStateMachine('enemyDeath', {
            enemyIdle: new EnemyIdleState(),
            enemyMove: new EnemyMoveState(),
            enemyAttack: new EnemyAttackState(),
            enemyDeath: new EnemyDeathState(),
        },[this, this.enemy]); 

    //Sprites
        var bg = this.add.image(0, -56, 'bg');
        bg.setOrigin(0,0);

        this.player = new PlayerCreate({scene:this});

        mummy = this.physics.add.sprite(200,0, 'mummy-idle');
        new MummyCreate({scene:this}, 200, mummy);

        this.enemy = new EnemyCreate({scene:this}, game.config.width); 
    
    //Colliders
        this.physics.add.overlap(enemy, rectW, playerHit.bind(this));

    //Floor
        base = this.add.graphics();
        this.physics.add.existing(base);
        base.body.setAllowGravity(false);
        base.body.immovable = true;
        base.body.width = 1000;
        base.body.height = 24;
        base.x = 0;
        base.y = baseX;

        this.physics.add.collider(player, base);
        this.physics.add.collider(enemy, base);
        this.physics.add.collider(mummy, base);

    //camera
        this.cameras.main.startFollow(player);
        this.cameras.main.followOffset.set(0, 120);
    }

    update() {
    //Movement
        new EnemyUpdate({scene:this}); 
        new PlayerUpdate({scene:this});
        
    //Text 
        document.querySelector('.debug').innerHTML = 
            'pl x - ' + player.x +

            '<br>' + 

            // 'mu x - ' + mummy.x +
            '';
    }
}



