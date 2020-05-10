var game;

class StateMachine 
{
    constructor(initialState, possibleStates, stateArgs=[]) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }

        stateMachine = this;
    }

    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
}

class State {
    enter() {

    }

    execute(){

    }
}

class EnemyStateMachine 
{
    constructor(initialState, possibleStates, stateArgs=[]) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;

        // State instances get access to the state machine via this.enemyStateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.enemyStateMachine = this;
        }

        enemyStateMachine = this;
    }

    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
}

class EnemyState {
    enter() {

    }

    execute(){

    }
}

//CONFIG
window.onload=function(){
    var config = {
            type: Phaser.AUTO,
            width: 812,
            height: 375,
            backgroundColor: 0xffffff,
            pixelArt: true, //fix blurred pixels
            zoom: 2,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 1200},
                    debug: true
                }
            },
            scene: [SceneMain, SceneTitle,]
            // scene: [SceneTitle, SceneMain, ]
        };
    game = new Phaser.Game(config);
}

//Lower HP if hit
function enemyHit (player)
{
    if (Date.now() > lastHitTimeEnemy + 1000/10 == true) 
    {
        playerHp--;  
        player.tint = 0xff0000;

        setInterval(
            function(){ player.tint = 0xffffff; },
            200
        );

        lastHitTimeEnemy = Date.now()
    }

    // //End game
        // if( enemyHp < 1)
        // {
        //     this.scene.start('SceneTitle');
        //     winText = 'Victory!'
        // }    
        // else if (playerHp < 1){
        //     this.scene.start('SceneTitle');
        //     winText = 'You have failed...'
        // }
}

function playerHit (enemy)
{
    if (Date.now() > lastHitTimePlayer + 1000/15 == true) 
    {
        enemyHp--;  
        enemyDamageReceived++;
        lastHitTimePlayer = Date.now()

        enemy.tint = 0x00ff00;

        setInterval(
            function(){ enemy.tint = 0xffffff; },
            250
        );
    }
    //End game
    // if( enemyHp < 1)
    // {
    //     this.scene.start('SceneTitle');
    //     winText = 'Victory!'
    // }    
    // else if (playerHp < 1){
    //     this.scene.start('SceneTitle');
    //     winText = 'You have failed...'
    // }
}

//Knockback player when blocked
function playerKnockback(){
    if(player.flipX ==false){
        player.setVelocityX(-blockTime);
    }
    else {
        player.setVelocityX(blockTime);
    }
}


//Player
var player;
var playerHp;
var lastHitTimePlayer = Date.now();
var playerW;
var weaponRange = 24;
var rectW;
var rectW2;

var attTime = 500;
var attStartupTime = 200;
var blockTime = 300;
var blockStartupTime = 0;

var jumpVel = 2000;
var jumpTime = 30;
var floatVelX = 200;
var floatVelY = 400;

var moveVel = 180;
var enMoveVel = 100;
var dashVel = 1000;
var dashTime = 20;


//Enemy
var enemy;
var enemyHp;
var lastHitTimeEnemy = Date.now();
var enemyW;
var enemyText
var fireball;
var enemyDamageReceived;

var minFightDistance = 80;
var maxFightDistance = 200;
var fightDistance = Phaser.Math.Between(minFightDistance, maxFightDistance);
var enemyProjectileVel = 400;
var enemyAttackSpeed = 1500;

var projectiles

//Controls
var keys;
var key1; //x
var key2; //z

//Environment
var platforms;

//Reference variables
var rNum;
var distance;
var speed;

var playerText;
var winText = '-';

var stateMachine;
var enemyStateMachine;
var state;









