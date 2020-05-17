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
            width: 374,
            height: 352,
            parent: 'phaser',
            backgroundColor: 0x000000,
            pixelArt: true, //fix blurred pixels
            zoom: 1.5,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 1200},
                    // debug: true
                }
            },
            scene: [SceneMain, SceneTitle,]
            // scene: [SceneTitle, SceneMain, ]
        };
    game = new Phaser.Game(config);
}

//Lower HP if hit
function enemyHit (player){
     
    // playerAp--;  
    player.tint = 0xff0000;

    setInterval(
        function(){ player.tint = 0xffffff; },
        400
    );
    
    //End game
    if( enemyAp < 1 || playerAp < 1)
    {
        game.scene.start('SceneTitle');
    }
}

function playerHit (enemy){
    
    //Decrese enemy hp
    enemyAp--;

    enemy.tint = 0x00ff00;

    setInterval(
        function(){ enemy.tint = 0xffffff; },
        250
    );


    //End game
    // if( enemyAp < 1 || playerAp < 1)
    // {
    //     game.scene.start('SceneTitle');
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
var playerAp;
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

var playerTouchedDown = true;
var turnAction;
var cell = 48;


//Enemy
var enemy;
var mummy;
var enemyAp;
var enemyW;

//Misc
var base;
var baseX = 268-12;

var platforms;
var distance;
var keys;
var smValue;

//State mahine
var stateMachine;
var enemyStateMachine;
var state;

//All actions
var actionsArray = [
    {
        label: 'Move left',
        var: 'moveLeft'
    },
    {
        label: 'Move right',
        var: 'moveRight'
    },
    {
        label: 'Attack',
        var: 'attack'
    },
    {
        label: 'Block',
        var: 'block'
    },
    {
        label: 'Bow',
        var: 'bow'
    },
];

//Drop pool
var dropArray = [
    {
        label: 'Block',
        var: 'block'
    },
    {
        label: 'Bow',
        var: 'bow'
    },
];

//Current actions
var playerActionsArray = [
    {
        label: "Move left",
        var: 'moveLeft'
    },
    {
        label: "Move right",
        var: 'moveRight'
    },
    {
        label: "Attack",
        var: 'attack'
    },
];

//Update actions
function generateActions (){
    var buttonContainer = document.querySelector('.button-container');
    var button = document.querySelector('button');
    

    //clear action bar
    if( button instanceof Element == true){
        var container = buttonContainer.childElementCount
        for (i=0; i < container; i++){
            var element = document.querySelector('button');
            element.parentNode.removeChild(element);
            // console.log('removed');
        }
    }

    

    if( playerAp - playerActionsArray.length < 0){
        smValue = playerAp;
    }
    else{
        smValue = playerActionsArray.length;
    }

    //generate actions
    for (i=0; i< smValue; i++){
        var btn = document.createElement("button");
        btn.setAttribute('onclick','turnAction = ' + '"' + playerActionsArray[i].var + '"');
        btn.innerHTML = playerActionsArray[i].label;
        buttonContainer.appendChild(btn);
    } 
}

//Loot
function getAction(){
    //get random action
            playerActionsArray.push(dropArray[Math.floor(Math.random() * dropArray.length)]);
            generateActions();
}