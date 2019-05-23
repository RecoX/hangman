import React from 'react';
import ReactDOM from 'react-dom';
import { httpGet } from './utils/utils';
import './index.css';

class Game extends React.Component {
    constructor(props) {
        super(props);
        const word = getNewWord()
        
        this.state = {
            alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            word: word,
            lives: 10,
            writtenLetters: [],
            matchedLetters: [],
        };
    }

    handleClickStartNewGame() {
        this.setState({
            word: getNewWord(),
            lives: 12,
            writtenLetters: [],
            matchedLetters: [],
        })
    }

    render() {
        return (
            <div>
                <span>{this.state.word.length} Letters to guess</span>
                <button className="start" onClick={() => this.handleClickStartNewGame()}>
                    Start New Game
                </button>
            </div>
        );
      }
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

