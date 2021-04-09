import React, { useState } from 'react';
import Party from './Components/Party/Party'
import Player from './Player'
import WheelComponent from './Components/WheelComponent/WheelComponent'
import './App.css';
import Trivia from './Components/Trivia/Trivia';

function shuffle(array: Player[]) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function Game(props: any) {
    const games = [WheelComponent, Party, Trivia];
    const [currentGameIndex, setCurrentGameIndex] = useState(1);

    const done = (affected: Player, score: number) => {
        affected.addScore(score);
        alert(`The winner is ${affected.toString()} with a total score of: ${affected.score}`);
        let newIndex = currentGameIndex;
        while (newIndex === currentGameIndex) { // Don't allow the same game twice in a row. 
            newIndex = Math.floor(Math.random() * games.length)
        }
        setCurrentGameIndex(newIndex);

    };

    // Method to work with the Trivia component.
    const doneTwoWinners = (affectedOne: Player, affectedTwo: Player, score: number) => {
        affectedOne.addScore(score);
        affectedTwo.addScore(score);
        alert(`The winners are ${affectedOne.toString()} with a total score of: ${affectedOne.score} and ${affectedTwo.toString()} with a total score of: ${affectedTwo.score}`);
        let newIndex = currentGameIndex;
        while (newIndex === currentGameIndex) { // Don't allow the same game twice in a row. 
            newIndex = Math.floor(Math.random() * games.length)
        }
        setCurrentGameIndex(newIndex);
    };

    // Method to work with the Trivia component.
    const doneNoWinners = () => {
        alert(`No points awarded!`);
        let newIndex = currentGameIndex;
        while (newIndex === currentGameIndex) { // Don't allow the same game twice in a row. 
            newIndex = Math.floor(Math.random() * games.length)
        }
        setCurrentGameIndex(newIndex);
    };

    const getPlayers = (amount: number): Player[] => {
        const result: Player[] = [];
        amount = Math.min(amount, props.players.length)
        shuffle(props.players);
        for (let i = 0; i < amount; i++) {
            result.push(props.players[i])
        }
        return result;
    };

    const gameProps = { getPlayers: getPlayers, done: done, doneTwoWinners: doneTwoWinners, doneNoWinners: doneNoWinners};
    switch (currentGameIndex) {
        case 2:
            return (<div className="Game"><Trivia gp={gameProps} /></div>);
        case 1:
            return (<div className="Game"><Party gp={gameProps} /></div>);
        case 0:
            return (<div className="Game"><WheelComponent gp={gameProps} /></div>);

    }
    return (
        <div className="Game">

        </div>
    );
}

export default Game;