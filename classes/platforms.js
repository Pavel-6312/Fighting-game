class PlatformsPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform-sm', 'assets/platform-sm.png');
        this.load.image('bg', 'assets/bg.png');
    }
};

class PlatformsCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        

        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.platforms = config.scene.platforms;
        platforms = this.physics.add.staticGroup();
        platforms.create(406, game.config.height - 24, 'platform');
    }
};