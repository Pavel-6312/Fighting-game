class PlatformsPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;

        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform-sm', 'assets/platform-sm.png');
        this.load.image('weapon', 'assets/swamp/3 Objects/Pointers/7.png');
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
        platforms.create(game.config.width/2, 384, 'platform');
        platforms.create(160, 352, 'platform-sm');
        platforms.create(game.config.width/2, 240, 'platform-sm');
    }
};