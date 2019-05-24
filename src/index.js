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
        }
        this.handleLetterButtonClick = this.handleLetterButtonClick.bind(this);
    }


    startNewGame() {
        const word = getNewWord()

        this.setState({
            word: word,
            lives: 12,
            writtenLetters: [word[0]],
            matchedLetters: [word[0]],
            isGameOver: false
        })
    }

    handleClickStartNewGame() {
        this.startNewGame()
    }

    handleLetterButtonClick(writtenLetters, lives, newLetter) {
        //First we check if the player lost or if he can continue playing the game
        const isGameOver = (lives - 1) <= 0 ? true : false

        //Then we set the state of the app, with the new letter and number of lives
        this.setState({
            lives: lives - 1,
            writtenLetters: [...writtenLetters, newLetter],
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
                    writtenLetters={this.state.writtenLetters}>
                </ScoreBoard>

                <AlphabetButtons
                    // matchedLetters={this.state.matchedLetters}
                    writtenLetters={this.state.writtenLetters}
                    lives={this.state.lives}
                    isGameOver={this.state.isGameOver}
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
                        onClick={() => props.handleLetterButtonClick(props.writtenLetters, props.lives, letter)}>
                            {letter}
                    </button>
        }
    })

    lettersButtons = props.isGameOver ? null : lettersButtons

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

    //Check if the game is in gameover status or we can play
    const showLivesLeftHtml = props.isGameOver ? <h1 className="gameover">GAME OVER... Insert Coin</h1> : <h1 className="lives-left">You have {props.lives} lives lefts</h1>

    return (
        <div>
            {showLivesLeftHtml}
            <h1>{wordsLettersHtml}</h1>
            <h1>{props.word.length} Letters to guess</h1>
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

