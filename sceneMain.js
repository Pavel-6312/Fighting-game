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
    //State machine (player)
        stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            dash: new DashState(),
            jump: new JumpState(),
            attack: new AttackState(),
            block: new BlockState(),
        },[this, this.player]);  

    //State machine (enemy)
        enemyStateMachine = new EnemyStateMachine('enemyAttack', {
            enemyIdle: new EnemyIdleState(),
            enemyMove: new EnemyMoveState(),
            enemyAttack: new EnemyAttackState(),
            enemyAvoid: new EnemyAvoidState(),
        },[this, this.enemy]);  

    //Sprites
        this.add.image(game.config.width/2, game.config.height/2, 'bg');
        this.platforms = new PlatformsCreate({scene:this});
        this.enemy = new EnemyCreate({scene:this}); 
        this.player = new PlayerCreate({scene:this});

    //Colliders
        this.physics.add.overlap(player, fireball, enemyHit.bind(this));
        this.physics.add.overlap(enemy, rectW, playerHit.bind(this));
        this.physics.add.collider(rectW2, fireball, playerKnockback.bind(this));
        

    //Controls
        keys = this.input.keyboard.createCursorKeys();
        key1 = this.input.keyboard.addKey('X');
        key2 = this.input.keyboard.addKey('Z');

    //HP text
        playerText = this.add.text(20 ,20 ,'Start', {
            fontSize: '12px',
            fontFamily: 'Raleway',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 8,
        });
    }

    update() {
    //Movement
        new EnemyUpdate({scene:this}); 
        new PlayerUpdate({scene:this});
        distance = player.x - enemy.x;
        
    //Text 
        playerText.setText(
            'Player Hp: ' + playerHp + 
            // // ' / floatVelX ' + floatVelX + 
            // ' / ' + player.direction +  
            // ' / attTime' + attTime +
            // ' / ' + player.state +
            // ' / ' + player.body.enable +
            // // ' / ' + rectW2.body.moves +
            // ' ' + stateMachine.state + 
            '\n'+

            'Enemy Hp: ' + enemyHp  +
            ' ' + enemyStateMachine.state  +
            ' / ' + enemyDamageReceived  +
            // ' / ' + enemy.body.velocity.x +
            // ' / ' + fightDistance +
            // ' / ' + enemyAttackSpeed +
            ' '
        );

    }
}



