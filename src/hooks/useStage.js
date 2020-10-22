import { useState, useEffect } from 'react'
import { createStage } from '../gameHelpers'

export const useStage = (player, resetPlayer) =>{
    const [stage, setStage] = useState(createStage())
    const [rowsCleared, setRowsCleared] = useState(0)

    useEffect( () => {
        setRowsCleared(0)

        const sweepRows = newStage =>
            newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1){
                    setRowsCleared( prev => prev +1 )
                    //this will replace deleted cells
                    ack.unshift( new Array(newStage[0].length).fill([0,'clear']))
                    return ack
                }
                ack.push(row)
                return ack
            }, [])

        const updateStage = prevStage => {
            //Frst flush the stage
            //later refacotr for a for loop since it will be faster than a map.
            const newStage = prevStage.map(row =>
                row.map( cell => ( cell[1] === 'clear' ? [0,'clear']: cell) )
                )

            //renders the tetromino on re-render of stage and draws the block
            // console.log(player.tetromino, player.pos)
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) =>{
                    if (value !== 0) {
                        newStage[y + player.pos.y][x+ player.pos.x] = [
                            value,
                            `${player.collided ? 'merged': 'clear'}`
                        ]
                    }
                })
            })
            console.log(player.collided)
            //Then check if we collided 
            if (player.collided) {
                resetPlayer()
                return sweepRows(newStage)
            }

            return newStage
        }

        setStage(prev => updateStage(prev))
    }, [player, resetPlayer])

    return [stage, setStage, rowsCleared]
}