//-----START GAME--------
let gameStarted = false;
let spaceshipSel = false;
let invaderSel = false;
let selector = false;
let play = false;

let selectedSpaceship = 1;
let spaceShipCount = 5;
let selectedInvader = 1;
let invaderCount = 5;

const rowNumber = 15;
const colNumber = 15;

let invadersPos = [];
let playerPos = rowNumber*colNumber-Math.floor(colNumber/2);
let laserPos = [];

let invadersInterval;
let laserInterval;

let movDirection = 'right';

//---KEYBOARD EVENT LISTENER
window.addEventListener("keydown", function(e){
    switch (e.key){
        //-----HANDLES SPACEBAR KEYDOWN
        case ' ':
            if (!gameStarted){
                startGame()
            } else if (!spaceshipSel){
                document.getElementById('selItem').style.backgroundImage = `url('img/invader1.png')`;
                spaceshipSel = true;
            } else if (!invaderSel){
                invaderSel = true;
                selector = false;
                document.getElementById('selector').style.display = 'none';
                document.querySelector(".selector-msg").style.display = 'none';
                document.getElementById('canvas').style.display = "flex";
                for (el of document.querySelectorAll(".end-msg")){el.style.display = 'none'};
                invadersPos = createGame (selectedSpaceship, selectedInvader);
            } else if (!play){
                play = true;
                invadersInterval = setInterval(function() {moveInvaders(selectedInvader);}, 300);
                laserInterval = setInterval(moveLaser, 150);
            } else {
                shoot();
            }
            break;
        //-----HANDLES ARROWLEFT KEYDOWN
        case 'ArrowLeft':
            if (selector){
                if (!spaceshipSel){
                    selectedSpaceship == 1 ? selectedSpaceship=spaceShipCount : selectedSpaceship-=1;
                    document.getElementById('selItem').style.backgroundImage = `url('img/spaceship${selectedSpaceship}.png')`;
                    break;
                }
                if (!invaderSel){
                    selectedInvader == 1 ? selectedInvader=invaderCount : selectedInvader-=1;
                    document.getElementById('selItem').style.backgroundImage = `url('img/invader${selectedInvader}.png')`;
                    break;
                }
            } else if (play){
                console.log("move izda")
                if (playerPos>((rowNumber-1)*colNumber)+1){
                    document.getElementById(playerPos).style.backgroundImage = `none`;
                    playerPos -= 1;
                    document.getElementById(playerPos).style.backgroundImage = `url('img/spaceship${selectedSpaceship}.png')`;
                }
                break;
            }
        //-----HANDLES ARROWRIGHT KEYDOWN
        case 'ArrowRight':
            if (selector){
                if (!spaceshipSel){
                    selectedSpaceship == spaceShipCount ? selectedSpaceship=1 : selectedSpaceship+=1;
                    document.getElementById('selItem').style.backgroundImage = `url('img/spaceShip${selectedSpaceship}.png')`;
                    break;
                }
                if (!invaderSel){
                    selectedInvader == invaderCount ? selectedInvader=1 : selectedInvader+=1;
                    document.getElementById('selItem').style.backgroundImage = `url('img/invader${selectedInvader}.png')`;
                    break;
                }
            } else if (play){
                console.log("move decha")
                if (playerPos<(rowNumber)*colNumber){
                    document.getElementById(playerPos).style.backgroundImage = `none`;
                    playerPos += 1;
                    document.getElementById(playerPos).style.backgroundImage = `url('img/spaceship${selectedSpaceship}.png')`;
                }
                break;
            }
    } 
})

//----START GAME--------
// transition from title to spaceship selector.
function startGame(){
    document.getElementById('title-img').classList.remove('title-img-big');
    document.getElementById('title-img').classList.add('title-img-small');
    for (let el of document.querySelectorAll(".welcome-msg")){
        el.style.display = 'none';
    }
    document.getElementById('selector').style.display = 'flex';
    document.querySelector(".selector-msg").style.display = 'block';
    gameStarted = true;
    selector = true;
}

//-----CREATE GAME CANVAS------

function createGame (selectedSpaceship, selectedInvader){

    invadersPos = [];
    playerPos = rowNumber*colNumber-Math.floor(colNumber/2);
    laserPos = [];
    const parent = document.getElementById("canvas")
    while (parent.firstChild) {
        parent.firstChild.remove()
    }

    for (let i=1; i<=rowNumber*colNumber; i++){
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', i)
        document.getElementById("canvas").appendChild(tile);
    }

    //--------CREATE PLAYER----------
    document.getElementById(playerPos).style.backgroundImage = `url('img/spaceship${selectedSpaceship}.png')`;


    //-----CREATE INITIAL INVADERS------
    // number of invaders and number of invader rows
    let inNumber = 31;
    let inRows = 3;

    //initial position of invaders
    let inX = 3;
    let inY = 2;

    let firstInPos = (inY-1)*colNumber+inX;


    for (let i=firstInPos; i<firstInPos+inNumber/inRows; i++){
        for (let z=0; z<inRows; z++){
            let delta = z*colNumber;
            invadersPos.push(i+delta);
        }  
    }

    for (pos of invadersPos){
        document.getElementById(pos).classList.add('invader');
        document.getElementById(pos).style.backgroundImage = `url('img/invader${selectedInvader}.png')`;
    }

    return invadersPos;

}

//-------ADD MOVEMENT TO INVADERS--------------

function moveInvaders(selectedInvader){
    // remove existing invaders
    for (inv of document.querySelectorAll(".invader")){
        inv.classList.remove('invader');
        inv.style.backgroundImage = 'none';
    }
    // set moving direction
    if (invadersPos.some((el)=>el%colNumber==0)){
        invadersPos = invadersPos.map((pos) => pos+=colNumber);
        movDirection = 'left';
    } else if (invadersPos.some((el)=>(el-1)%colNumber==0)){
        invadersPos = invadersPos.map((pos) => pos+=colNumber);
        movDirection = 'right';
    }
    // move
    if (movDirection=='right'){
        invadersPos = invadersPos.map((pos) => pos+=1);
        for (pos of invadersPos){
            document.getElementById(pos).classList.add('invader');
            document.getElementById(pos).style.backgroundImage = `url('img/invader${selectedInvader}.png')`;
        }
    }
    if (movDirection=='left'){
        invadersPos = invadersPos.map((pos) => pos-=1);
        for (pos of invadersPos){
            document.getElementById(pos).classList.add('invader');
            document.getElementById(pos).style.backgroundImage = `url('img/invader${selectedInvader}.png')`;
        }
    } 
    //check game over
    if (invadersPos.some((el)=>el>(colNumber-1)*rowNumber)){
        //alert("GAME OVER");
        clearInterval(invadersInterval);
        clearInterval(laserInterval);
        invaderSel = false;
        play = false;
        document.getElementById('canvas').style.display = "none";
        document.querySelector(".gameover-msg").style.display = 'block';
        document.querySelector(".playagain-msg").style.display = 'block';
    }  
    if (invadersPos.length<=0){
        //alert("YOU WIN");
        clearInterval(invadersInterval);
        clearInterval(laserInterval);
        invaderSel = false;
        play = false;
        document.getElementById('canvas').style.display = "none";
        document.querySelector(".win-msg").style.display = 'block';
        document.querySelector(".playagain-msg").style.display = 'block';
    }
}

//-----------HANDLE SHOOTING--------------
function moveLaser(){
    for (laser of document.querySelectorAll('.laser')){
        laser.classList.remove('laser');
    }    
    laserPos = laserPos.map(pos=>pos-=15);
    laserPos = laserPos.filter(pos=>pos>0);
    for (pos of laserPos){
        document.getElementById(pos).style.backgroundImage = '';
        document.getElementById(pos).classList.add('laser');
    }
    killInvader();
}

function killInvader(){ 
    let killed = invadersPos.filter((inPos)=>{
        return laserPos.indexOf(inPos)>= 0;
    })
    for (inv of killed){
        document.getElementById(inv).classList.remove('invader');
    }
    invadersPos = invadersPos.filter((invPos)=>{
        return killed.indexOf(invPos)<0;
    })
    laserPos = laserPos.filter((lasPos)=>{
        return killed.indexOf(lasPos)<0;
    })
}

function shoot(){
    console.log("disparo")
    laserPos.push(playerPos-15);
    document.getElementById(playerPos-15).classList.add('laser');
}







