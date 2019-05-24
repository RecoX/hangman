import React from 'react';
import ReactDOM from 'react-dom';
import { httpGet } from './utils/utils';
import './index.css';

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: '',
            lives: 0,
            writtenLetters: [],
            matchedLetters: [],
            isGameOver: true,
            isWin: false,
        }
        this.handleLetterButtonClick = this.handleLetterButtonClick.bind(this);
    }

    handleClickStartNewGame() {
        const word = getNewWord()
        
        this.setState({
            word: word,
            lives: 12,
            writtenLetters: [word[0]],
            matchedLetters: [word[0]],
            isGameOver: false,
            isWin: false
        })
    }
    
    checkIfPlayerWon(letterArray) {
        //Filter array to obtain unique values
        letterArray = [...new Set(letterArray)]; 

        if (this.state.matchedLetters.length === letterArray.length) {
            this.setState({
                isWin: true
            })
        }
    }

    async handleLetterButtonClick(newLetter) {
        //First we check if the letter is included in the word, if is push it on the matchedLetters array
        //With the spread operator as REACT doesn't like push because it mutates the array

        let wordLettersArray = this.state.word.split('')
        if (wordLettersArray.includes(newLetter)) {
            //We use await here as setState is async, we probably can use a callback but like this is ok and tidy.
            await this.setState({
                matchedLetters: [...this.state.matchedLetters, newLetter],
            })
        }

        this.checkIfPlayerWon(wordLettersArray)

        //First we check if the player lost or if he can continue playing the game
        const isGameOver = (this.state.lives - 1) <= 0 ? true : false

        //Then we set the state of the app, with the new letter and number of lives
        this.setState({
            lives: this.state.lives - 1,
            writtenLetters: [...this.state.writtenLetters, newLetter],
            isGameOver: isGameOver
        })
    }

    render() {
        return (
            <div>
                <ScoreBoard 
                    word={this.state.word} 
                    lives={this.state.lives}
                    isGameOver={this.state.isGameOver}
                    isWin={this.state.isWin}
                    writtenLetters={this.state.writtenLetters}>
                </ScoreBoard>

                <AlphabetButtons
                    writtenLetters={this.state.writtenLetters}
                    matchedLetters={this.state.matchedLetters}
                    lives={this.state.lives}
                    isGameOver={this.state.isGameOver}
                    isWin={this.state.isWin}
                    handleLetterButtonClick={this.handleLetterButtonClick}>
                </AlphabetButtons>
                
                <button className="start-new-game" onClick={() => this.handleClickStartNewGame()}>
                    Start New Game
                </button>
            </div>
        );
      }
}

function AlphabetButtons (props) {
    //Here we create the buttons for each letter in the alphabet
    //If we used the button disabled, else we can give it a try 

    let lettersButtons = alphabet.map((letter, index) => {
        if (props.writtenLetters.indexOf(letter) !== -1) {
            return <button 
                        key={index}
                        disabled>
                            {letter}
                    </button>
        } else {
            return <button 
                        key={index} 
                        value={letter}
                        onClick={() => props.handleLetterButtonClick(letter)}>
                            {letter}
                    </button>
        }
    })

    lettersButtons = (props.isGameOver || props.isWin) ? null : lettersButtons
    
    return (
        <div>
            {lettersButtons}
        </div>
    )
}

function ScoreBoard(props) {
    //Obtain each letter from the string
    const wordLettersArray = props.word.split('')

    //If we used the letter show it, else print _
    const wordsLettersHtml = wordLettersArray.map((letter, index) => {
        if (props.writtenLetters.indexOf(letter) !== -1) {
            return <span className="letter-guessed" key={index}> {letter} </span>
        } else {
            return <span className="letter-to-guess" key={index}> _ </span>
        }
    })

    const writtenLettersHtml = props.writtenLetters.map((letter, index) => {
        return <b key={index} >{letter}</b>
    })
    
    //If we don't have a word yet, hide this
    const numberLettersOfWord = props.word.length > 0 ? <h1>{props.word.length} letters contains the word</h1> : null

    //Check if the game is in gameover status or we can play
    let showLivesLeftHtml = props.isGameOver ? <h1 className="gameover">GAME OVER... Insert Coin</h1> : <h1 className="lives-left">You have {props.lives} lives lefts</h1>

    //Check if we win
    showLivesLeftHtml = props.isWin ? <h1 className="win">YOU WIN CONGRATULATIONS :)</h1> : showLivesLeftHtml
    
    return (
        <div>
            {showLivesLeftHtml}
            <h1>{wordsLettersHtml}</h1>
            {numberLettersOfWord}
            <span>Letters used: </span> {writtenLettersHtml}
        </div>
    )
}

function getNewWord() {
    // Obtain all the words from the resource, convert the string into an array and filter words with less than 3 letters
    const allWordsString = httpGet("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt")
    let wordsArray = allWordsString.split("\r\n");
    wordsArray = wordsArray.filter(el => el.length > 3)

    //Return a random value of the array to play the game :)
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
}

ReactDOM.render(<Game />, document.getElementById("root"));

