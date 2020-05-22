class firstScene extends Phaser.Scene {
    constructor() 
    {
        super('firstScene');
    }

    preload() { 
        this.load.image('bg', 'assets/bg.png')
        new PlayerPreload({scene:this}); 
        new EnemyPreload({scene:this}); 
    }

    create() {   
   

    //create environment
        var bg = this.add.image(0, -56, 'bg')
        bg.setOrigin(0,0);

        base = this.add.graphics()
        this.physics.add.existing(base)
        base.body.setAllowGravity(false)
        base.body.immovable = true
        base.body.width = 1000
        base.body.height = 24
        base.x = 0
        base.y = baseX

    //create unites
        this.player = new PlayerCreate({scene:this}, cell/2 + cell * 4)
        stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            death: new DeathState(),
            endturn: new EndTurnState(),
            block: new BlockState(),
            bow: new BowState(),
        },[this, this.player]);  

        this.enemy = new EnemyCreate({scene:this}, cell/2 + cell * 9); 
        enemyStateMachine = new EnemyStateMachine('enemyDeath', {
            enemyIdle: new EnemyIdleState(),
            enemyMove: new EnemyMoveState(),
            enemyAttack: new EnemyAttackState(),
            enemyDeath: new EnemyDeathState(),
        },[this, this.enemy]); 

    //create generic enemies
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

    //colliders
        this.physics.add.collider(player, base);
        this.physics.add.collider(enemy, base);

    //camera
        this.cameras.main.startFollow(player);
        this.cameras.main.followOffset.set(0, 120);
    }

    update() {
        new PlayerUpdate({scene:this});
        
    //text 
        document.querySelector('.debug').innerHTML = 
            'ap: ' + playerAp +'<br>'+ 
            'turnAction: ' + turnAction +'<br>'+ 
            'enemyTurn: ' + enemyTurn +'<br>'+
            '';
    }
}





