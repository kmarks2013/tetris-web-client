import {useReducer, useEffect} from 'react'


const scoreReducer = (state, action) => {
    switch (action.type) {
        case 'get_scores':
            return {...state, scores: action.payload}
        case 'add_score':
            return {...state, player: action.payload}
        default:
            return state
    }
}


export const useScores = () => {
    const [state, dispatch] = useReducer(scoreReducer, {scores:[]})
    const scores = state.scores


    const topTen = scores.slice(0,10)

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