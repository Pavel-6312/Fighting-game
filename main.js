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

window.onload=function(){
    var config = {
            type: Phaser.AUTO,
            width: 812,
            height: 375,
            backgroundColor: 0xffffff,
            pixelArt: true, //fix blurred pixels
            zoom: 1,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 1200},
                    debug: false
                    // debug: true
                }
            },
            scene: [SceneMain, SceneTitle,]
            // scene: [SceneTitle, SceneMain, ]
        };
    game = new Phaser.Game(config);
}

//Player
var player;
var playerHp;
var lastHitTimePlayer = Date.now();
var playerW;

//Enemy
var enemyHp;
var enemy;
var lastHitTimeEnemy = Date.now();
var enemyW;

//Controls
var keys;
var keyAction1;
var keyAction2;

//Environment
var platforms;

//Reference variables
var rNum;
var distance;
var speed;
var playerHpText;
var weaponRange;

var stateMachine;
var state;