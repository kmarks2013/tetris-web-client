import {useReducer, useEffect} from 'react'


const scoreReducer = (state, action) => {
    switch (action.type) {
        case 'get_scores':
            console.log('miss')
            return {...state, scores: action.payload}
        case 'add_score':
            console.log('hit', action.payload)
            return {...state, player: action.payload}
        default:
            return state
    }
}


export const useScores = () => {
    const [state, dispatch] = useReducer(scoreReducer, {scores:[], player:{}})
    const scores = state.scores
    // const player = state.player

    const topTen = scores.slice(0,10)

    // const saveScore = (gamerTag, playerScore) => {
    //     console.log(gamerTag, playerScore)
    //     //this will post the score to user with params of gamertag and score.
    //     // it will then update the state of scores and console.log it.
    //     fetch('http://localhost:3000/users/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         },
    //         body: JSON.stringify({
    //                 gamertag: gamerTag,
    //                 score: playerScore
    //         })
    //     })
    //     .then(res => res.json())
    //     .then( newScore => {
    //         return dispatch({type: 'add_score', payload: newScore})
    //     }, console.log(player,scores))
    // }

    useEffect( () => {
        console.log(state)
        fetch('http://localhost:3000/highscores')
        .then(res => res.json())
        .then( scores => 
            dispatch({type:"get_scores", payload:scores}) 
        )
    }, [])

    return {scores, topTen}
}