
class ButtonCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.scene = config.scene;
        // this.game = game.config.scene;

        var group = this.scene.add.group();

        var btnMoveLeft = this.scene.add.text(20, 400, 'Move left', { 
            fontSize: '20px',
            fontFamily: 'Raleway',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 8, 
        });
        btnMoveLeft.setInteractive({ useHandCursor: true });
        btnMoveLeft.on('pointerdown', () => {moveLeft = true;});

        var btnMoveRight = this.scene.add.text(20, 440, 'Move right', { 
            fontSize: '20px',
            fontFamily: 'Raleway',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 8,
        });
        // btnMoveRight.setInteractive({ useHandCursor: true });
        btnMoveRight.on('pointerdown', () => {moveRight = true;});

        group.add(btnMoveLeft, btnMoveRight);

        //Add props to sprites
        group.children.iterate(function (child) {
            child.setInteractive({ useHandCursor: true });
        });
    }
};