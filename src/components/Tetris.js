import React, { useState, useRef, useEffect } from 'react'
import Title from './Title'
import Footer from './Footer'
import Display from './Display'
import Stage from './Stage'
import NextStage from './NextStage'
import GameOverMenu from './GameOverMenu'
import PauseMenu from './PauseMenu'
import {Button} from './Button'
import AudioMenu from './AudioMenu'

import { usePlayer } from '../hooks/usePlayer'
import { useInterval } from '../hooks/useInterval'
import { useStage } from '../hooks/useStage'
import { useGameStatus } from '../hooks/useGameStatus'
import { useAudio } from '../hooks/useAudio'
import { useNextStage} from '../hooks/useNextStage'
import { useNextTetro } from '../hooks/useNextTetro'

import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris'
import {createStage, checkCollision, createNext } from '../gameHelpers'
import { Instructions } from './Instructions'
import { StyledSideBar } from './styles/StyledSideBar'


const Tetris = () => {
    const [ dropTime, setDropTime ] = useState(null)
    const [ gameOver, setGameOver ] = useState(false)
    const [ start, setStart] = useState(false)
    const [ paused, setPaused ] = useState(false)
    const [ nextTetro, resetTetro ] = useNextTetro()
    const [ player, updatePlayerPos, resetPlayer, playerRotate ] = usePlayer(nextTetro)
    const [ nextStage, setNextStage ] = useNextStage(nextTetro, resetTetro, player)
    const [ stage, setStage, rowsCleared ] = useStage(player, resetPlayer)
    const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared)
    const { audio, toggleSound, pauseAudio, restartAudio, playing, setPlaying} = useAudio()

    const unPauseRef = useRef()

    useEffect(() => {
        const wakeUpFetch = async () => {
            await fetch('https://tetriact-api.herokuapp.com/highscores')
            console.log('scores fetched')
        }
        wakeUpFetch()
    }, [])

    const movePlayer = dir => {
        //change this name because it moves tetrominos left or right
        if (!checkCollision(player, stage, {x:dir, y:0})){
            updatePlayerPos({ x: dir, y:0})
        }
    }


    const startGame = () => {
        toggleSound()
        setStage(createStage())
        setNextStage(createNext())
        setDropTime(1200)
        resetTetro()
        resetPlayer()
        setGameOver(false)
        setPaused(false)
        setStart(true)
        setScore(0)
        setRows(0)
        setLevel(0)
        unPauseRef.current.focus()
    }

    const closeGameOver = () => {
        setGameOver(false)
    }

    const clearBoard = () => {
        setStage(createStage())
        setNextStage(createNext())
        setGameOver(false)
        setScore(0)
        setRows(0)
        setLevel(0)
    }

    const pauseGame = () => {
        setPaused(true)
        pauseAudio(audio)
        setDropTime(null)
    }

    const resumeGame = () => {
        if (playing){
            restartAudio(audio)
        }
        console.log(playing)
        setDropTime(1000/ (level+1) + 200)
        setPaused(false)
        console.log(unPauseRef)
        unPauseRef.current.focus()
    }

    const drop = () => {
        //increase level when player has cleared 10 rows and increase speed

        if (rows > (level + 1 ) * 10){
            setLevel(prev => prev + 1 )
            // Also increases speed <- try out different formulas to test out speed
            setDropTime(1000/ (level+1) + 200)
        }

        if (!checkCollision(player, stage, {x: 0, y : 1})){
            updatePlayerPos({ x: 0 , y: 1, collided: false})
        } else {
            // Game Over
            if (player.pos.y < 1){
                setGameOver(true)
                setDropTime(null)
            }
            updatePlayerPos({ x: 0 , y: 0, collided: true})
        }
    }

    const keyUp = ({keyCode}) => {
        if (!gameOver && !paused){
            if (keyCode === 40){
                setDropTime(1000/ (level+1) + 200)
            }
        }
    }

    const dropPlayer = () => {
         setDropTime(null)
         drop()
    }

    const move = ({ keyCode }) => {
        if (!gameOver && !paused){
            if(keyCode === 37){
                movePlayer(-1)
            } else if (keyCode === 39){
                movePlayer(1)
            } else if (keyCode === 40){
                dropPlayer()
            } else if (keyCode === 38){
                playerRotate(stage, 1)
            } else if (keyCode === 13){
                pauseGame()
            }
        } else if (paused){
            if (keyCode === 27){
                resumeGame()
            }
        }
    }

    useInterval(() => {
        drop()
    }, dropTime)

    return (
        <StyledTetrisWrapper
            role='button'
            tabIndex='0'
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
            ref={unPauseRef}
        >
            {gameOver? audio.pause(): null}
            <Title/>
            <StyledTetris>
            <StyledSideBar>
            <NextStage nextStage={nextStage} />
            <Instructions/>
            </StyledSideBar>
            <Stage stage={stage} />
            <aside>
                <div>
                    <Display text={`Score: ${score}`} />
                    <Display text={`Rows: ${rows}`}/>
                    <Display text={`Level: ${level}`} />
                </div>
                <Button width={100} margin={0} text="Start Game" callback={startGame} />
                {start ? <Button width={100} margin={0} text="Pause Game" callback={pauseGame} />: null}
                {start ? <AudioMenu song={audio} setPlaying={setPlaying} /> : null}
            </aside>
            { paused ?  <PauseMenu callback={resumeGame}/> : null}
            { gameOver ?  <GameOverMenu newGame={startGame} closeMenu={closeGameOver} clearBoard={clearBoard} score={score}/> : null }
            </StyledTetris>
            <Footer />
        </StyledTetrisWrapper>
    )
}

export default Tetris
