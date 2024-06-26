import { WORDS } from "./words.js"; //attaches js file with word options


const NUMBER_OF_GUESSES = 6  //all caps since value is known
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = [];  //each letter gets displayed as they're entered
let nextLetter = 0;  //index of the array
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]  //generate random num 0-1 rounded down, times array index 0-5
console.log(rightGuessString)   //can inspect correct word


function initBoard(){
    let board = document.getElementById('game-board');

    //creates 6 rows, adds to the board container
    for (let i = 0; i < NUMBER_OF_GUESSES; i++){
        let row = document.createElement('div')
        row.className = "letter-row"
        
        //creates 5 boxes for each row as children
        for (let j = 0; j < 5; j++){
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)  //appends in each row
        }

        board.appendChild(row)  //appends in board container
    }
    
}

initBoard()  //refeshes board on page load


document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {   //no response if all boxes are filled
        return
    }
 
    let pressedKey = String(e.key) //parse key into a string to allow for comparison
    if (pressedKey === "Backspace" && nextLetter !== 0)  {  //deletes letter, unless there is no letter
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {  //run checkGuess if Enter is clicked
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)   //regular expression, allows for matching of a-z
    if (!found || found.length > 1) {  //if not found or more than 1 key, then exit/do nothing
        return
    } else {
        insertLetter(pressedKey) //if single key, then run insertLetter
    }
})


//checks for emptyspace, finds correct row, inserts letter in the box
function insertLetter (pressedKey) {
    if (nextLetter === 5) {   //check if you're at end of the row
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]  //gives current empty row
    let box = row.children[nextLetter]   //moves to next empty box
    box.textContent = pressedKey  //add content to box
    box.classList.add("filled-box")   //formats the box
    currentGuess.push(pressedKey) //adds key to end of word guess in array
    nextLetter += 1   //adds 1 to the index/counter
}

//finds correct row and box, removes the key and returns to emptyspace
function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]  //gives current row
    let box = row.children[nextLetter - 1] //gives most current filled box
    box.textContent = ""   //sets to empty box
    box.classList.remove("filled-box")  //removes styling
    currentGuess.pop()   //removes last key of the array/word
    nextLetter -= 1  //takes one away from the counter
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)  //pulls word from random word list, const at the top

    for (const val of currentGuess) {
        guessString
    }


}
