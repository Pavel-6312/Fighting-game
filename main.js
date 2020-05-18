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
            width: 460,
            height: 360,
            parent: 'phaser',
            backgroundColor: 0x151826,
            pixelArt: true, //fix blurred pixels
            zoom: 1.5,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 1200},
                    // debug: true
                }
            },
            scene: [firstScene, SceneTitle,]
            // scene: [SceneTitle, firstScene, ]
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
    
    enemyAp--;
    enemy.tint = 0x00ff00;

    setInterval(
        function(){ enemy.tint = 0xffffff; },
        250
    );
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
var cell = 48;

var turnAction;
var enemyTurn = false;

//Enemy
var enemy;
var mummy;
var mummy2;
var enemyAp;
var enemyW;
var enemyState;


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
    {
        label: "Block",
        var: 'block'
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

var enemyArray =[
    {
        id: 'mummy',
        animKey: 'mummy',
        ap: 2,
        state: 'idle',
        stateTimer: 0,
    },
    {
        id: 'mummy2',
        animKey: 'mummy',
        ap: 2,
        state: 'idle',
        stateTimer: 0,
    },
];

//Calculate cell distance
function distance(from, to){
    var distance;
    if(from.x < to.x){
        distance = (to.x - from.x) / cell;
    }
    else{
        distance = (to.x - from.x) / cell;
    }
    return distance;
}

function baseAi(scene, id , animKey, arrayKey){
        var distanceM = distance(player, id);

        //death
        if (enemyArray[arrayKey].ap <= 0 && id.body !== undefined){
            id.anims.play(animKey + '-death', false);

            scene.time.delayedCall(500, () => {
                getAction(); //drop
                id.destroy();
            }); 
        }

        enemyArray[arrayKey].stateTimer--;

        if (enemyArray[arrayKey].stateTimer === 0){
            enemyArray[arrayKey].state = 'idle';
            enemyArray[arrayKey].stateTimer = 0;
            id.tint = 0xffffff;
        }

        else if(distanceM < 4 && id.body !== undefined && enemyArray[arrayKey].state !== 'stun'){
            
            //move left
            if (distanceM > 1){
                id.anims.play(animKey + '-walk', true).setFlipX(false); 
                scene.tweens.add({
                    targets: id,
                    x: id.x - cell,
                    ease: 'Power1',
                    duration: 500,
                });
            }

            //move right
            else if (distanceM < -1){
                id.anims.play(animKey + '-walk', true).setFlipX(true);
                scene.tweens.add({
                    targets: id,
                    x: id.x + cell,
                    ease: 'Power1',
                    duration: 500,
                });
            }  

            //attack left
            else if (distanceM < 2 && distanceM >= 0){
                id.anims.play(animKey + '-attack', true).setFlipX(false);

                if(turnAction != 'block'){
                    playerAp--;
                }
                else {
                    console.log('blocked');
                    enemyArray[arrayKey].stateTimer = 1;
                    enemyArray[arrayKey].state = 'stun';
                    id.tint = 0xffff00;
                }
            }
            
            //attack right
            else if (distanceM > -2 && distanceM <= 0){
                id.anims.play(animKey + '-attack', true).setFlipX(true); 

                if(turnAction != 'block'){
                    playerAp--;
                }
                else {
                    console.log('blocked');
                    enemyArray[arrayKey].stateTimer = 1;
                    enemyArray[arrayKey].state = 'stun';
                    id.tint = 0xffff00;
                }
            }      
        }

        //find a way to play it without a delay
        // id.anims.play(animKey + '-idle', true);
    }

