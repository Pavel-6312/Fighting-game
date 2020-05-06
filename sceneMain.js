class SceneMain extends Phaser.Scene {
    constructor() 
    {
        super('SceneMain');
    }

    preload()
    {
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform-sm', 'assets/platform-sm.png');
        this.load.image('weapon', 'assets/swamp/3 Objects/Pointers/7.png');

        this.load.image('bg', 'assets/bg.png');

        new EnemyPreload({scene:this}); 
        new PlayerPreload({scene:this}); 
    }

    create() 
    {     
    //Environment
        // var bg = this.add.image(game.config.width/2,game.config.height/2,'bg');
        platforms = this.physics.add.staticGroup();
        platforms.create(game.config.width/2, 384, 'platform');
        platforms.create(160, 352, 'platform-sm');
        platforms.create(game.config.width/2, 240, 'platform-sm');
    
    //HP Txt
        playerHpText = this.add.text(20 ,20 ,'Start',{color:0xff0000});

    //Sprites
        this.player = new PlayerCreate({scene:this});
        this.enemy = new EnemyCreate({scene:this}); 
        
    // Enemy weapon
        enemyW = this.physics.add.sprite(enemy.x, enemy.y, 'weapon');
        enemyW.body.setAllowGravity(false);
        enemyW.setAlpha(0);
        this.physics.add.overlap(enemyW, player, enemyHit.bind(this));

    //Player weapon
        playerW = this.physics.add.sprite(player.x, player.y, 'weapon');
        playerW.body.setAllowGravity(false);
        playerW.setAlpha(0);
        this.physics.add.overlap(playerW, enemy, playerHit.bind(this));

    //CONTROLS
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey('R');
        keyE = this.input.keyboard.addKey('E');

    }

    update() 
    {
    //State machine
        this.stateMachine.step();

    //HP text
        playerHpText.setText('Player HP ' + playerHp + ' / ' + 'Enemy HP ' + enemyHp); 

    //End game
        if(playerHp < 1 || enemyHp < 1)
        {
            this.scene.start('SceneTitle');
        }

    //Movement
        new EnemyUpdate({scene:this}); 
        new PlayerUpdate({scene:this}); 
    }
}

function enemyHit (player)
{
    if (Date.now() > lastHitTimeEnemy + 1000/10 == true) 
    {
        player.setTint(0xff0000);
        // playerHp--;  
        lastHitTimeEnemy = Date.now()
    }
}

function playerHit (enemy)
{
    if (Date.now() > lastHitTimePlayer + 1000/15 == true) 
    {
        enemy.setTint(0xff0000);
        // enemyHp--;  
        lastHitTimePlayer = Date.now()
    }
}
