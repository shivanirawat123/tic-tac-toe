let count = 0;
let chosenPlayer;
const OPTIONS = {
    Player1 : "circle",
    Player2 : "cross",
}
const WINNING_SITUATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
let resultDeclared = false;
const addedClassNames = [];
const cells = Array.from(document.querySelectorAll('.cell'));
const result = document.querySelector('.result');
const allOptions = document.querySelectorAll('.js-option');

document.addEventListener('click',function(e){
    if(e.target.classList.contains('js-option')){
        chosenPlayer = e.target.id === OPTIONS.Player1 ? "Player1" : "Player2";
        disableOptionSelection(true);
    }
    if(e.target.classList.contains('cell') && !e.target.classList.contains('played') && !resultDeclared){
        let currentOption;
        if(!chosenPlayer){
            chosenPlayer = "Player1";
            currentOption = chosenPlayer;
            disableOptionSelection(true);
        }
        count += 1;
        if(count%2 ===0 ){
            currentOption = chosenPlayer === "Player1" ? OPTIONS.Player2 : OPTIONS.Player1;
        }
        else{
            currentOption = OPTIONS[chosenPlayer];
        }
        e.target.classList.add('played',currentOption);
        addedClassNames.push('played',currentOption);
        if(count > 3){
            const winIndex = checkIfWon(currentOption);
            if (winIndex > -1){
                WINNING_SITUATIONS[winIndex].forEach(index => {
                    cells[index].classList.add('transform');
                    addedClassNames.push('transform');
                    let transformDir = ''
                    switch(winIndex){
                        case 0: case 1: case 2:                     
                            transformDir = 'to bottom';
                            break;
                        case 3: case 4: case 5:                     
                            transformDir = 'to right';
                            break;
                        case 6:                     
                            transformDir = 'to top right';
                            break;
                        case 7:                     
                            transformDir = 'to bottom right';
                            break;

                    }
                    document.documentElement.style.setProperty('--backgroundDir',transformDir);
                });
                result.innerHTML = `${currentOption === OPTIONS.Player1 ? "O" : "X"} wins.`;
                resultDeclared  = true;
            }
            else if (count === 9){
                result.innerHTML = `Match Draw.`;
                resultDeclared  = true;
            }
        }
    };

    if(e.target.classList.contains('js-reset')){
        resetGame();
    }
})

function disableOptionSelection(disable){
    allOptions.forEach(option => {
        disable ? option.setAttribute('disabled','true') : option.removeAttribute('disabled') ;
    });
}
function checkIfWon(currentOption){
    const index = WINNING_SITUATIONS.findIndex(situation => {
        return situation.every(index => {
            return cells[index].classList.contains(currentOption);
        });
        
    });
    return index;
}

function resetGame(){
    cells.forEach(cell => cell.classList.remove(...addedClassNames));
    result.innerHTML = "";
    disableOptionSelection(false);
    chosenPlayer = "";
    addedClassNames.length = 0;
    resultDeclared  = false;
    count = 0;
}