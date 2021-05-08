import React, { useState, useEffect } from 'react';
import Party from './Components/Party/Party'
import Player from './Player'
import WheelComponent from './Components/WheelComponent/WheelComponent'
import BackToBack from './Components/BackToBack/BackToBack';
import Trivia from './Components/Trivia/Trivia'
import getUtilService from './util/UtilServiceFactory'
import IUtilService from './util/IUtilService'
import WinnerAlert from './WinnerAlert'

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
    const games = [WheelComponent, Party, BackToBack, Trivia];
    const [currentGameIndex, setCurrentGameIndex] = useState(1);
    const [triviaEvents, setTriviaEvents] = useState<GameEventAPI | undefined>(undefined)
    const [backToBackEvents, setBackToBackEvents] = useState<GameEventAPI | undefined>(undefined)
    const [partyEvents, setPartyEvents] = useState<GameEventAPI | undefined>(undefined)
    
    // Load data to game events
    useEffect(() => {
        getUtilService()
            .then((s: IUtilService) => {
                // maybe promise allSettled is better to use then if one promise is rejected you can use some cached events
                Promise.all([s.getTrivia(), s.getBackToBack(), s.getParty()]).then((response) => {
                    setTriviaEvents(response[0])
                    setBackToBackEvents(response[1])
                    setPartyEvents(response[2])

                    console.log('response[0]', response[0])
                    console.log('response[1]', response[1])
                    console.log('response[2]', response[2])
                })
            })
    }, [])

    const addScore = (p: Player, score: number) => {
        p.addScore(score)
    }

    const makeWinnerAlert = (p: any) => {
        let str: string

        // If p is an array, display an alert for multiple players
        if (Array.isArray(p)) {
            str = 'The winners are: \n'
            p.forEach(element => {
                str = str + `${element.toString()} with a total score of: ${element.score} \n`
            });

            // If there is no param, display an alert for no points given
        } else if (p == null) {
            str = `No points awarded!`

            //If p is a single player object, display an alert for one winner
        } else if (p instanceof Player) {
            str = `The winner is ${p.toString()} with a total score of: ${p.score}`
        } else {
            str = ``
        }

        alert(str);
    }

    const chooseRandomNewGame = () => {
        let newIndex = currentGameIndex;
        while (newIndex === currentGameIndex) { // Don't allow the same game twice in a row. 
            newIndex = Math.floor(Math.random() * games.length)
        }
        setCurrentGameIndex(newIndex);
    }

    const getPlayers = (amount: number): Player[] => {
        const result: Player[] = [];
        amount = Math.min(amount, props.players.length)
        shuffle(props.players);
        for (let i = 0; i < amount; i++) {
            result.push(props.players[i])
        }
        return result;
    };

    const getRandomGameEvent = (gameEventAPI: GameEventAPI): IBackToBack | IParty | ITrivia => {
        return gameEventAPI.questions[Math.floor(Math.random() * gameEventAPI.questions.length)]
    }

    const gameProps = { 
        getPlayers: getPlayers, 
        addScore: addScore, 
        makeWinnerAlert: makeWinnerAlert, 
        chooseRandomNewGame: chooseRandomNewGame
    };

    if (!triviaEvents || !backToBackEvents || !partyEvents) {
        return (<div><p>Loading...</p></div>)
    }
    let currentGame;
    switch (currentGameIndex) {
        case 3: 
        currentGame = <Trivia gp={gameProps} gameEvent={getRandomGameEvent(triviaEvents)}/>;
        break;
        case 2:
            currentGame = <BackToBack gp={gameProps} gameEvent={getRandomGameEvent(backToBackEvents)}/>;
            break;
        case 1:
            currentGame = <Party gp={gameProps} gameEvent={getRandomGameEvent(partyEvents)}/>;
            break;
        case 0:
            currentGame = <WheelComponent gp={gameProps} />;
            break;

    }
    return (
        <div>{currentGame}</div>
    );
}

export default Game;