//code will have several local variables that help to simplify the code with a longer script


import { WORDS } from "./words.js"; //attaches js file with word options


const NUMBER_OF_GUESSES = 6  //all caps since value is known
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];  //each letter gets displayed as they're entered
let nextLetter = 0;  //index of the array
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]  //generate random num 0-1 rounded down, times array index 0-5
console.log(rightGuessString)   //can inspect correct word


//initialize game board
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



//accept user input from keyboard
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
    animateCSS(box, "pulse")   //pulse box before it's filled
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

    for (const val of currentGuess) {   //loops through array and adds to the string
        guessString  += val 
    }

    if (guessString.length != 5) {  //checks for 5 letters before enter
        toaster.error("Not enough letters!")
        return
    }

    if(!WORDS.includes(guessString)){  //looks for guessString in possible list of words
        toastr.error("word not in list!")
        return
    }

    for(let i = 0; i < 5; i++){   //loop through the entry
        let letterColor = ''
        let box = row.children[i]   //the child of the row is a box 1-5
        let letter = currentGuess[i]   //index of current guess
        
        //checks if letter is in correct position compared to word list
        //returns -1 if it doesn't exist
        let letterPosition = rightGuess.indexOf(currentGuess[i])  

        if (letterPosition === -1) {  //invalid guess appears grey
            letterColor = 'grey'
        } else {
            //letter is in word, correct position/index
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {   //letter is in the word, but not position/index
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }
        
        let delay = 250 * i
        setTimeout(() => {    //puts shading in the box
            animateCSS(box, 'flipInX')  //flip the box befor color add
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor) //shades the letter, function listed below
        }, delay)
    }

    if (guessString === rightGuessString) {   //conditional for winning the game
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0  //forces game to end
        return
    } else {
        guessesRemaining -= 1;  //removes 1 from guess count if wrong
        currentGuess = []; //moves to next row with empty array
        nextLetter = 0;  //reset to beginning

        if (guessRemaining === 0) {  //indicates last guess
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)  //displays the correct word, game over
        }
    }

}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) { //for every key on keyboard, does letter match color
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor  //get current color of key
            if (oldColor === 'green'){  //keeps the key green
                return
            }

            if (oldColor === 'yellow' && color !== 'green'){  //if yellow, allow key to turn green
                return
            }

            elem.style.backgroundColor = color  //
            break
        }
    }
}

//creates input for on-screen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target  //identify what was clicked
    
    //not a keyboard button, exit function
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    //sets key = to the text on the keyboard button
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 
    //mimics the physical keyboard with the virtual board and allows for clicking
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})



const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      // const node = document.querySelector(element);
      const node = element
      node.style.setProperty('--animate-duration', '0.3s');
      
      node.classList.add(`${prefix}animated`, animationName);
  
      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });
