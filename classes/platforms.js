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

        platforms = this.scene.physics.add.group();
        platforms.create(406, game.config.height - 12, 'pl-base');
        platforms.create(0, game.config.height - 24, 'pl-c12');
        platforms.create(game.config.width, game.config.height - 24, 'pl-c12');
        
        //Create up to 10 pl-4
        for (var i=0; i < Phaser.Math.Between(1, 5); i++){
            var rY = Phaser.Math.Between(48, game.config.height -48);
            var rX = Phaser.Math.Between(0, game.config.width);
            
            platforms.create(
                rX,
                rY,
                'pl-4'
            );
        }

        //Create up to 10 pl-1
        for (var i=0; i < Phaser.Math.Between(1, 5); i++){
            var rY = Phaser.Math.Between(48, game.config.height -48);
            var rX = Phaser.Math.Between(0, game.config.width);
            
            platforms.create(
                rX,
                rY,
                'pl-1'
            );
        }

        // Create up to 10 pl-c4
        for (var i=0; i < Phaser.Math.Between(1, 5); i++){
            var rY = Phaser.Math.Between(48, game.config.height -48);
            var rX = Phaser.Math.Between(0, game.config.width);
            
            platforms.create(
                rX,
                rY,
                'pl-c4'
            );
        }

        //Platform props
        platforms.children.iterate(function (child) {
            child.body.immovable = true;
            child.body.setAllowGravity(false);
            child.body.setCollideWorldBounds(true);
            child.body.setVelocityX(0);     
        });
        
    }
};

class PlatformsUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        
        this.scene = config.scene;
        this.physics = config.scene.physics;

        if(platforms.children.entries[0].x > game.config.width-48){
            console.log(1);
            resetPosition();
        }

        
    }
};

function resetPosition(){
    console.log(2);
    platforms.children.entries[0].x = 0;

    platforms.children.iterate(function (child) {
            child.body.immovable = true;
            child.body.setAllowGravity(false);
            child.body.setCollideWorldBounds(true);
            child.body.setVelocityX(100);     
        });
}