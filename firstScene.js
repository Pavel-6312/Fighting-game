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
   
        stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            death: new DeathState(),
            endturn: new EndTurnState(),
            block: new BlockState(),
        },[this, this.player]);  

        enemyStateMachine = new EnemyStateMachine('enemyDeath', {
            enemyIdle: new EnemyIdleState(),
            enemyMove: new EnemyMoveState(),
            enemyAttack: new EnemyAttackState(),
            enemyDeath: new EnemyDeathState(),
        },[this, this.enemy]); 

    //create environment
        var bg = this.add.image(0, -56, 'bg');
        bg.setOrigin(0,0);
    
        base = this.add.graphics();
        this.physics.add.existing(base);
        base.body.setAllowGravity(false);
        base.body.immovable = true;
        base.body.width = 1000;
        base.body.height = 24;
        base.x = 0;
        base.y = baseX;

    //create player
        this.player = new PlayerCreate({scene:this}, cell/2 + cell * 2);

    //create enemies
        for(var i=0; i < enemyArray.length; i++){
            //create sprite
            window[enemyArray[i].id] = this.physics.add.sprite(cell/2 + cell * enemyArray[i].spawn, 0, enemyArray[i].animKey + '-idle');
            //load all anims
            new BasicEnemyAnimsCreate({scene:this}, enemyArray[i].animKey);
            //run idle
            window[enemyArray[i].id].anims.play(enemyArray[i].animKey + '-idle', false);
            //collider
            this.physics.add.collider(window[enemyArray[i].id], base);
        }

    //create boss
        this.enemy = new EnemyCreate({scene:this}, game.config.width);    

    //colliders
        this.physics.add.collider(player, base);
        this.physics.add.collider(enemy, base);

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





