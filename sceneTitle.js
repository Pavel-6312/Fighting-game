class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    }
    
    preload()
    {   
        this.load.image('bg-win', 'assets/bg-win.png');
        this.load.image('bg-loose', 'assets/bg-loose.png');
    }

    create() {
        keys = this.input.keyboard.createCursorKeys();

        if(playerAp > enemyAp){
            this.add.image(game.config.width/2, game.config.height/2, 'bg-win');

        }  
        else if (playerAp < enemyAp){
            this.add.image(game.config.width/2, game.config.height/2, 'bg-loose');
        }
    }

    update()     
    {
        const{left, right, up, down, space, shift} = keys;

        if(space.isDown == true){
            this.scene.start('SceneMain');
        }
    }
}