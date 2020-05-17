class PlatformsPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        this.load.image('bg', 'assets/bg.png');

        this.load.image('pl-base', 'assets/pl-base.png');

        this.load.image('pl-1', 'assets/pl-1.png');
        this.load.image('pl-4', 'assets/pl-4.png');

        this.load.image('pl-c4', 'assets/pl-c4.png');
        this.load.image('pl-c12', 'assets/pl-c12.png');
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

        platforms = config.scene.physics.add.group();
        // platforms.create(0, 316, 'pl-base');
        

        //Platform props
        platforms.children.iterate(function (child) {
            child.body.immovable = true;
            child.body.setAllowGravity(false);
            child.body.setCollideWorldBounds(true);
            child.body.setVelocityX(0);     
        });   

        
    }
};