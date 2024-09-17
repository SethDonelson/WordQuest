
import { WORDS } from "./words.js"; //attaches js file with word options


const NUMBER_OF_GUESSES = 6  //all caps since value is known
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];  //each letter gets displayed as they're entered
let nextLetter = 0; 
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)] 
console.log(rightGuessString)  


//initialize game board
function initBoard(){
    let board = document.getElementById('game-board');

    //creates 6 rows
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

initBoard()  



//accept user input from keyboard
document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) { 
        return
    }
 
    let pressedKey = String(e.key) //parse key into a string to allow for comparison
    if (pressedKey === "Backspace" && nextLetter !== 0)  {  //deletes letter, unless there is no letter
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") { 
        checkGuess()
        return
    }

    //matches a-z, ignore invalid letter
    let found = pressedKey.match(/[a-z]/gi)  
    if (!found || found.length > 1) {  
        return
    } else {
        insertLetter(pressedKey) 
    }
})


//checks for emptyspace, finds correct row, inserts letter in the box
function insertLetter (pressedKey) {
    if (nextLetter === 5) {   //check if you're at end of the row
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]  
    let box = row.children[nextLetter]   
    animateCSS(box, "pulse")   
    box.textContent = pressedKey  
    box.classList.add("filled-box")   
    currentGuess.push(pressedKey) 
    nextLetter += 1   
}

//finds correct row and box, removes the key and returns to emptyspace
function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining] 
    let box = row.children[nextLetter - 1] 
    box.textContent = ""   
    box.classList.remove("filled-box")  
    currentGuess.pop()   
    nextLetter -= 1  
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)  

    for (const val of currentGuess) {   //loops through array and adds to the string
        guessString  += val 
    }

    if (guessString.length != 5) {  
        toaster.error("Not enough letters!")
        return
    }

    if(!WORDS.includes(guessString)){  
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
            } else {  
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }
        
        //shades box and letter
        let delay = 250 * i
        setTimeout(() => {    
            animateCSS(box, 'flipInX')  
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor) 
        }, delay)
    }

    //game winning condition
    if (guessString === rightGuessString) {   
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0  
        return
    } else {
        //removes a guess
        guessesRemaining -= 1;  
        currentGuess = []; 
        nextLetter = 0;  

        if (guessRemaining === 0) {  //indicates last guess
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)  
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

            elem.style.backgroundColor = color  
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


//animation setup
const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = element
      node.style.setProperty('--animate-duration', '0.3s');
      
      node.classList.add(`${prefix}animated`, animationName);
  
      // end the animation
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });
