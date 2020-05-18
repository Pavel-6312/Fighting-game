class firstScene extends Phaser.Scene {
    constructor() 
    {
        super('firstScene');
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
            attack: new AttackState(),
            death: new DeathState(),
            endturn: new EndTurnState(),
            block: new BlockState(),
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

        this.player = new PlayerCreate({scene:this}, cell/2 + cell * 3);
        new BasicEnemyAnimsCreate({scene:this}, mummy, 'mummy');

        mummy = this.physics.add.sprite(cell/2 + cell * 5, 0, 'mummy-idle');
        mummy.anims.play('mummy-idle', false);

        mummy2 = this.physics.add.sprite(cell/2 + cell * 8, 0, 'mummy-idle');
        mummy2.anims.play('mummy-idle', false);

        this.enemy = new EnemyCreate({scene:this}, game.config.width);    

    //Floor
        base = this.add.graphics();
        this.physics.add.existing(base);
        base.body.setAllowGravity(false);
        base.body.immovable = true;
        base.body.width = 1000;
        base.body.height = 24;
        base.x = 0;
        base.y = baseX;

    //Colliders
        this.physics.add.collider(player, base);
        this.physics.add.collider(enemy, base);
        this.physics.add.collider(mummy, base);
        this.physics.add.collider(mummy2, base);
        this.physics.add.overlap(enemy, rectW, playerHit.bind(this));

    //camera
        this.cameras.main.startFollow(player);
        this.cameras.main.followOffset.set(0, 120);
    }

    update() {
    //Movement
        new PlayerUpdate({scene:this});
        
    //Text 
        document.querySelector('.debug').innerHTML = 
            // 'pl cell: ' + (player.x-cell/2) / cell +'<br>'+ 
            // 'mu cell: ' + (mummy.x-cell/2) / cell +'<br>'+

            // 'distancem1: ' + distance(player, mummy) +'<br>'+
            // 'distance m2: ' + distance(player, mummy2) +'<br>'+

            'ap: ' + playerAp +'<br>'+ 
            'turnAction: ' + turnAction +'<br>'+ 
            'enemyTurn: ' + enemyTurn +'<br>'+ 
            enemyArray[0].state +'<br>'+ 
            enemyArray[0].stateTimer +
            '';
    }
}





