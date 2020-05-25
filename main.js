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
            zoom: 1,
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

//Player
var player, playerAp
var stateMachine, state

//Enemy
var enemy, mummy, mummy2, dog
var enemyAp, enemyState, enemyStateMachine
var enemyTurn = false

//Misc
var turnAction ={
    id:null,
    action:null
}
var base, distance, keys, availableActions
var baseX = 268-12
var cell = 48



//All actions
var actionsArray = [
    {
        label: '&#8592 Move',
        var: 'moveLeft',
    },
    {
        label: 'Move &#8594;',
        var: 'moveRight',
    },
    {
        label: 'Attack',
        var: 'attack',
        durability: 66,
    },
    {
        label: 'Block',
        var: 'block',
        durability: 64,
    },
    {
        label: 'Bow',
        var: 'bow',
        durability: 62,
    },
]

//Current actions
var playerActionsArray = [
    {
        label: '&#8592 Move',
        var: 'moveLeft',
        type:'basic'
    },
    {
        label: 'Move &#8594;',
        var: 'moveRight',
        type:'basic'
    },
    {
        label: 'Attack',
        var: 'attack',
        durability: 66,
    },
    {
        label: 'Block',
        var: 'block',
        durability: 64,
    },
    {
        label: 'Block',
        var: 'block',
        durability: 64,
    },
    {
        label: 'Bow',
        var: 'bow',
        durability: 62,
    },
]

//Generate actions
function generateActions (){
    var buttonContainer = document.querySelector('.button-container'); //html button div
    var button = document.querySelector('button'); //html button object

    //clear action bar
    if(button instanceof Element == true){ //check if buttons are in DOM
        var container = buttonContainer.childElementCount
        for (i=0; i < container; i++){ //loop through all buttons
            document.querySelector('button').parentNode.removeChild(document.querySelector('button'));
            console.log('delete');
        }
    }

    //clear actions with 0 duravility
    playerActionsArray = playerActionsArray.filter(function( obj ) {
        return obj.durability !== 0;
    });

    //check if there are more actions than ap
    if( playerAp - playerActionsArray.length < 0){
        availableActions = playerAp;
    }
    else{
        availableActions = playerActionsArray.length;
    }

    //add actions
    for (i=0; i< availableActions; i++){
        var btn = document.createElement("button");
        btn.setAttribute('onclick', 'saveAction(' + i + ')'); //update turnAction var on click

        if(actionsArray[i].durability != undefined){
            btn.innerHTML = playerActionsArray[i].label + ' (' + playerActionsArray[i].durability +')'; //add durability
            console.log('update durability');
        }
        else {
            btn.innerHTML = playerActionsArray[i].label;
        }

        buttonContainer.appendChild(btn);
    } 
}

function saveAction(i){
    turnAction.id = i
    turnAction.action = playerActionsArray[i].var 
}

//Loot
function getAction(){
    //exclude basic actions
    dropArray = playerActionsArray.filter(function( obj ) {
        return obj.type !== 'basic';
    });
    //get random action
    playerActionsArray.push(dropArray[Math.floor(Math.random() * dropArray.length)]);
    generateActions();
    console.log('loot');
}






var enemyArray =[
    {
        id: 'mummy',
        animKey: 'mummy',
        ap: 2,
        state: 'idle',
        stateTimer: 0,
        spawn: 7,
        distance: 0,
    },
    {
        id: 'mummy2',
        animKey: 'deceased',
        ap: 2,
        state: 'idle',
        stateTimer: 0,
        spawn: 8,
        distance: 0,
    },
    {
        id: 'dog',
        animKey: 'dog',
        ap: 2,
        state: 'idle',
        stateTimer: 0,
        spawn: 7,
        distance: 0,
    },
]

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

        enemyArray[arrayKey].stateTimer--;
        
        //death
        if (enemyArray[arrayKey].ap <= 0 && id.body !== undefined){
            id.anims.play(animKey + '-death', true);

            scene.time.delayedCall(500, () => {
                getAction(); //drop
                id.destroy();
                enemyArray.splice(arrayKey, 1);
            }); 
        }

        else if (enemyArray[arrayKey].stateTimer === 0){
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
                    // playerAp--;
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

