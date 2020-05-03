var game;

window.onload=function()
{
var config = {
        type: Phaser.AUTO,
        width: 684,
        height: 300,
        backgroundColor: 0xffffff,
        pixelArt: true, //fix blurred pixels
        zoom: 1,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 1200},
                debug: false
            }
        },
        scene: [SceneTitle,SceneMain]
    };
    game = new Phaser.Game(config);
}

var player;
var enemy;
var cursors;
var platforms;
var rNum;
var distance;
var speed;
var playerHp;
